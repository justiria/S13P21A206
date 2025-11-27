package com.aicontact.backend.couple.repository;


import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CoupleRepository extends JpaRepository<CoupleEntity, Long> {

    @Query("SELECT c FROM CoupleEntity c WHERE c.user1 = :user OR c.user2 = :user")
    Optional<CoupleEntity> findByUser(@Param("user") UserEntity user);

    // 사용자 쌍으로 커플 찾기 (양방향 대응)
    @Query("SELECT c FROM CoupleEntity c WHERE (c.user1 = :u1 AND c.user2 = :u2) OR (c.user1 = :u2 AND c.user2 = :u1)")
    Optional<CoupleEntity> findByUserPair(@Param("u1") UserEntity user1, @Param("u2") UserEntity user2);

    Optional<CoupleEntity> findByUser1_IdOrUser2_Id(Long user1Id, Long user2Id);
}

