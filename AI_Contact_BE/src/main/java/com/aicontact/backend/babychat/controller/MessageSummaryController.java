package com.aicontact.backend.babychat.controller;

import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.babychat.dto.response.BabyLetterResponse;
import com.aicontact.backend.babychat.entity.BabyLetter;
import com.aicontact.backend.babychat.repository.BabyLetterRepository;
import com.aicontact.backend.babychat.service.GmsChatService;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/summary")
@RequiredArgsConstructor
public class MessageSummaryController {

    private final GmsChatService service;
    private final BabyLetterRepository letterRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final CoupleRepository coupleRepository;

    @GetMapping(
            path = "/letter",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<String>> getSummaryLetter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();

        String letter = service.summarizeToLetter(userId);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, letter));
    }


    @GetMapping(
            path = "/letters",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<BabyLetterResponse>>> getLetters(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUserEntity().getEmail();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 유저는 존재하지 않습니다."));

        Long myId = user.getId();

        CoupleEntity couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new RuntimeException("사용자에게 연결된 커플이 없습니다."));

        UserEntity myPartner = couple.getUser1().getId().equals(myId)
                ? couple.getUser2()
                : couple.getUser1();

        if (myPartner == null) {
            throw new RuntimeException("커플 정보 없음");
        }

        List<BabyLetter> letters = letterRepository
                .findBySenderUserOrderByCreatedAtDesc(myPartner);

        List<BabyLetterResponse> responses = letters.stream()
                .map(BabyLetterResponse::from)
                .toList();

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, responses));
    }

    @GetMapping(
            path = "/letters/unread-count",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<Integer>> getUnreadLettersCount(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUserEntity().getEmail();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 유저는 존재하지 않습니다."));

        Long myId = user.getId();

        CoupleEntity couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new RuntimeException("사용자에게 연결된 커플이 없습니다."));

        UserEntity myPartner = couple.getUser1().getId().equals(myId)
                ? couple.getUser2()
                : couple.getUser1();

        if (myPartner == null) {
            throw new RuntimeException("커플 정보 없음");
        }

        int unreadCount = letterRepository.countBySenderUserAndIsReadFalse(myPartner);

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, unreadCount));
    }

    @PatchMapping(
            path = "/letters/{letterId}/read",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<Void>> markLetterAsRead(
            @PathVariable Long letterId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUserEntity().getEmail();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 유저는 존재하지 않습니다."));

        BabyLetter letter = letterRepository.findById(letterId)
                .orElseThrow(() -> new RuntimeException("편지를 찾을 수 없습니다."));

        // 보안 검증: 해당 편지가 현재 사용자가 받을 수 있는 편지인지 확인
        // (파트너가 보낸 편지인지 확인)
        CoupleEntity couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new RuntimeException("사용자에게 연결된 커플이 없습니다."));

        UserEntity myPartner = couple.getUser1().getId().equals(user.getId())
                ? couple.getUser2()
                : couple.getUser1();

        if (!letter.getSenderUser().getId().equals(myPartner.getId())) {
            throw new RuntimeException("해당 편지에 접근할 권한이 없습니다.");
        }

        letter.setIsRead(true);
        letterRepository.save(letter);

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, null));
    }



}

