package com.aicontact.backend.nickname.repository;


import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.nickname.entity.NicknameEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NicknameRepository extends JpaRepository<NicknameEntity, Long> {
    List<NicknameEntity> findByCouple(CoupleEntity couple);
    boolean existsByCoupleAndWord(CoupleEntity couple, String word);
}


