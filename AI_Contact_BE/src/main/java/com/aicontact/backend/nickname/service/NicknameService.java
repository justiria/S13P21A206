package com.aicontact.backend.nickname.service;


import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.nickname.entity.NicknameEntity;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.nickname.repository.NicknameRepository;
import com.aicontact.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NicknameService {

    private final NicknameRepository nicknameRepository;
    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;

    public NicknameEntity create(String word, String description, String userEmail) {
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CoupleEntity couple = coupleRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Couple not found"));

        if (nicknameRepository.existsByCoupleAndWord(couple, word)) {
            throw new RuntimeException("중복 애칭");
        }

        NicknameEntity nickname = new NicknameEntity();
        nickname.setWord(word);
        nickname.setDescription(description);
        nickname.setCreator(user);
        nickname.setCouple(couple);

        return nicknameRepository.save(nickname);
    }

    public List<NicknameEntity> getByCouple(String userEmail) {
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CoupleEntity couple = coupleRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Couple not found"));

        return nicknameRepository.findByCouple(couple);
    }

    @Transactional
    public NicknameEntity update(Long id, String nickname, String description, String userEmail) {
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NicknameEntity nicknameEntity = nicknameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nickname not found"));

        // 수정 권한 체크 (커플에 속해있는 사용자만 가능)
        CoupleEntity couple = nicknameEntity.getCouple();
        if (!couple.hasUser(user)) {
            throw new RuntimeException("No permission to update this nickname");
        }

        nicknameEntity.setWord(nickname);
        nicknameEntity.setDescription(description);
        return nicknameEntity;
    }

    @Transactional
    public void delete(Long id, String userEmail) {
        UserEntity user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NicknameEntity nicknameEntity = nicknameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nickname not found"));

        CoupleEntity couple = nicknameEntity.getCouple();
        if (!couple.hasUser(user)) {
            throw new RuntimeException("No permission to delete this nickname");
        }

        nicknameRepository.delete(nicknameEntity);
    }

}



