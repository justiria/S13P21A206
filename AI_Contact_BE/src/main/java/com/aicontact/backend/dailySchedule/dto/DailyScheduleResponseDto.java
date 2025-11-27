package com.aicontact.backend.dailySchedule.dto;

import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DailyScheduleResponseDto {

    private Long id;
    private String title;
    private String memo;
    private LocalDateTime scheduleDate;

    private Long coupleId;
    private Long creatorId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DailyScheduleResponseDto fromEntity(DailyScheduleEntity schedule) {
        return DailyScheduleResponseDto.builder()
                .id(schedule.getId())
                .title(schedule.getTitle())
                .memo(schedule.getMemo())
                .scheduleDate(schedule.getScheduleDate())
                .coupleId(schedule.getCouple().getId())
                .creatorId(schedule.getCreator().getId())
                .createdAt(schedule.getCreatedAt())
                .updatedAt(schedule.getUpdatedAt())
                .build();
    }
}

