package com.aicontact.backend.babychat.entity;

import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.user.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "baby_chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BabyChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_children_id", nullable = false)
    private AiChildEntity aiChild;

    @Enumerated(EnumType.STRING)
    private AiMessageType aiMessageType;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "conversation_session_id", length = 36)
    private String conversationSessionId;

    @Column(name = "created_at")
    @Builder.Default
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'+09:00'", timezone = "Asia/Seoul")
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
