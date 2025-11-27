package com.aicontact.backend.aiChild.repository;

import com.aicontact.backend.aiChild.entity.AiChildEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AiChildRepository extends JpaRepository<AiChildEntity, Long> {

    /**
     * 특정 couple_id에 속한 AI 자녀 목록 조회
     */
    Optional<AiChildEntity> findByCoupleId(Long coupleId);

    @Modifying
    @Query("UPDATE AiChildEntity c SET c.experiencePoints = c.experiencePoints + 10")
    int incrementDailyExperience();

}
