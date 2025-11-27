package com.aicontact.backend.couple.entity;

import com.aicontact.backend.global.entity.BaseTimeEntity;
import com.aicontact.backend.user.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "couples")
@Getter
@Setter
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class CoupleEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 한 커플은 user1 < user2 조건으로 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private UserEntity user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private UserEntity user2;


    @Column(name = "matched_at")
    private LocalDateTime matchedAt = LocalDateTime.now();


    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "couple_name")
    private String coupleName;

    public boolean hasUser(UserEntity user) {
        return user1.equals(user) || user2.equals(user);
    }

}

