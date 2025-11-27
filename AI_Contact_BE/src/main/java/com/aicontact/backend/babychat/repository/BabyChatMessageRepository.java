package com.aicontact.backend.babychat.repository;

import com.aicontact.backend.babychat.entity.AiMessageType;
import com.aicontact.backend.babychat.entity.BabyChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BabyChatMessageRepository extends JpaRepository<BabyChatMessage, Long> {

    List<BabyChatMessage> findTop20ByUserIdAndConversationSessionIdOrderByCreatedAtDesc(
            Long userId, String conversationSessionId
    );

    List<BabyChatMessage> findByUserIdOrderByCreatedAtAsc(Long userId);

    List<BabyChatMessage> findByUserIdAndAiMessageTypeAndCreatedAtAfter(
            Long userId, AiMessageType aiMessageType, LocalDateTime createdAt);
}
