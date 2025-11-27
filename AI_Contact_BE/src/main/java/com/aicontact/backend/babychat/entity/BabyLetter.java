package com.aicontact.backend.babychat.entity;

import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "baby_letters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BabyLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private CoupleEntity couple;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id", nullable = false)
    private UserEntity senderUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_children_id", nullable = false)
    private AiChildEntity aiChildren;

    @Column(name = "letter_content", columnDefinition = "TEXT", nullable = false)
    private String letterContent;

    @Column(name = "conversation_session_id", length = 36)
    private String conversationSessionId;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

