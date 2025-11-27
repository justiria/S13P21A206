package com.aicontact.backend.babychat.repository;

import com.aicontact.backend.babychat.entity.BabyLetter;
import com.aicontact.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BabyLetterRepository extends JpaRepository<BabyLetter, Long> {
    List<BabyLetter> findBySenderUserOrderByCreatedAtDesc(UserEntity senderUser);
    int countBySenderUserAndIsReadFalse(UserEntity senderUser);
}
