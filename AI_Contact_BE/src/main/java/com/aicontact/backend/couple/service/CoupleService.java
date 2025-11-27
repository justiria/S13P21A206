package com.aicontact.backend.couple.service;

import com.aicontact.backend.couple.dto.request.CoupleMatchingRequest;
import com.aicontact.backend.couple.dto.request.CoupleUpdateRequest;
import com.aicontact.backend.couple.dto.response.CoupleInfoResponse;
import com.aicontact.backend.couple.dto.response.CoupleResponse;
import com.aicontact.backend.couple.dto.response.PartnerResponse;
import com.aicontact.backend.couple.dto.response.VerificationCodeResponse;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.global.entity.enumeration.CoupleStatus;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CoupleService {
    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;

    @Transactional
    public CoupleResponse joinByCode(Long myId, String matchCode) {
        UserEntity me = userRepository.findById(myId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "로그인 유저를 찾을 수 없습니다."));

        UserEntity target = userRepository.findByVerificationCode(matchCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "매칭 코드를 가진 사용자를 찾을 수 없습니다."));

        // 자기 코드 방지
        if (me.getId().equals(target.getId())) {
            return new CoupleResponse(false, null);
        }

        // 본인/상대 모두 SINGLE 인지 확인
        if (me.getCoupleStatus() != CoupleStatus.SINGLE ||
            target.getCoupleStatus() != CoupleStatus.SINGLE) {
            return new CoupleResponse(false, null);
        }

        // (선택) 코드 만료/상태 검증을 working하려면 matching_codes 테이블 로직 추가
        return new CoupleResponse(true, target.getId());
    }


    @Transactional
    public CoupleInfoResponse getCoupleInfo(Long userId) {
        CoupleEntity couple = coupleRepository
                .findByUser1_IdOrUser2_Id(userId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "해당 사용자의 커플 정보를 찾을 수 없습니다."));

        return new CoupleInfoResponse(couple);
    }

    @Transactional
    public CoupleEntity createCouple(Long currentUserId,
                                           CoupleMatchingRequest req) {
        // 1) 유저 조회
        UserEntity me      = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "로그인 유저를 찾을 수 없습니다."));
        UserEntity partner = userRepository.findById(req.getPartnerId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "상대 유저를 찾을 수 없습니다."));

        // 2) 상태 검증
        if (me.getCoupleStatus() != CoupleStatus.SINGLE ||
                partner.getCoupleStatus() != CoupleStatus.SINGLE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "이미 커플 상태이거나 매칭할 수 없습니다.");
        }

        // 3) user1Id < user2Id 가 되도록 순서 정렬
        UserEntity first  = me.getId() < partner.getId() ? me : partner;
        UserEntity second = me.getId() < partner.getId() ? partner : me;

        // 4) Couple 엔티티 생성
        CoupleEntity couple = new CoupleEntity();
        couple.setUser1(first);
        couple.setUser2(second);
        couple.setStartDate(req.getStartDate());   // null 허용
        couple.setCoupleName(req.getCoupleName()); // null 허용
        coupleRepository.save(couple);

        // 5) 두 유저 상태 COUPLED 로 변경
        me.setCoupleStatus(CoupleStatus.COUPLED);
        partner.setCoupleStatus(CoupleStatus.COUPLED);

        // 6) 두 유저 커플 id 채우기
        me.setCoupleId(couple.getId());
        partner.setCoupleId(couple.getId());

        userRepository.saveAll(Arrays.asList(me, partner));

        // 7) 생성된 Couple 정보 반환
        return couple;
    }

    @Transactional
    public void deleteCouple(Long userId) {
        // 1) 현재 유저가 속한 Couple 조회
        CoupleEntity couple = coupleRepository
                .findByUser1_IdOrUser2_Id(userId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "삭제할 커플 정보를 찾을 수 없습니다."));

        // 2) 양쪽 유저 꺼내기
        UserEntity u1 = couple.getUser1();
        UserEntity u2 = couple.getUser2();

        // 3) 커플 레코드 삭제
        coupleRepository.delete(couple);

        // 4) 유저 상태를 SINGLE로 변경
        u1.setCoupleStatus(CoupleStatus.SINGLE);
        u2.setCoupleStatus(CoupleStatus.SINGLE);

        // 5) 유저 커플 ID를 null로 변경
        u1.setCoupleId(null);
        u2.setCoupleId(null);

        userRepository.saveAll(List.of(u1, u2));
    }

    @Transactional
    public CoupleInfoResponse updateCoupleInfo(Long userId,
                                               CoupleUpdateRequest req) {
        CoupleEntity c = coupleRepository
                .findByUser1_IdOrUser2_Id(userId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "커플 정보를 찾을 수 없습니다."));

        // ① startDate
        if (req.getStartDate() != null) {
            c.setStartDate(req.getStartDate());
        }

        // ② coupleName
        if (req.getCoupleName() != null) {
            c.setCoupleName(req.getCoupleName());
        }

        coupleRepository.save(c);

        return new CoupleInfoResponse(c);
    }

    @Transactional
    public VerificationCodeResponse getMyCode(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        // 엔티티 필드명이 getVerificationCode() 라고 가정
        return new VerificationCodeResponse(user.getVerificationCode());
    }

    @Transactional
    public PartnerResponse getPartnerInfo(Long myId) {
        CoupleEntity couple = coupleRepository
                .findByUser1_IdOrUser2_Id(myId, myId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "커플 정보를 찾을 수 없습니다."));

        UserEntity partner = couple.getUser1().getId().equals(myId)
                ? couple.getUser2()
                : couple.getUser1();

        return PartnerResponse.builder()
                .id(partner.getId())
                .name(partner.getName())
                .email(partner.getEmail())
                .birthDate(partner.getBirthDate())
                .profileImageUrl(partner.getProfileImageUrl())
                .build();
    }

}