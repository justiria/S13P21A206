package com.aicontact.backend.user.repository;

import com.aicontact.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    boolean existsByEmail(String email);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByVerificationCode(String code);

    Optional<UserEntity> findByVerificationCode(String matchCode);

}
