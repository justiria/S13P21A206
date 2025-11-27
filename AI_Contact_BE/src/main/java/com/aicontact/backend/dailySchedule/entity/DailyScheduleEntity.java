package com.aicontact.backend.dailySchedule.entity;

import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.global.entity.BaseTimeEntity;
import com.aicontact.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_schedules",
        indexes = {
                @Index(name = "idx_couple_date", columnList = "couple_id, schedule_date"),
                @Index(name = "idx_creator_date", columnList = "creator_id, schedule_date")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyScheduleEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 커플 단위 일정 공유
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private CoupleEntity couple;

    // 작성자 (User 기준)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private UserEntity creator;

    @Column(name = "schedule_date", nullable = false)
    private LocalDateTime scheduleDate;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    private String memo;

}

