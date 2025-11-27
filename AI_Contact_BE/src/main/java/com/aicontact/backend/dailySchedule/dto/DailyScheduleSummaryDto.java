package com.aicontact.backend.dailySchedule.dto;

import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DailyScheduleSummaryDto {
    private Long id;
    private String title;
    private LocalDateTime scheduleDate;

    public static DailyScheduleSummaryDto fromEntity(DailyScheduleEntity schedule) {
        return DailyScheduleSummaryDto.builder()
                .id(schedule.getId())
                .title(schedule.getTitle())
                .scheduleDate(schedule.getScheduleDate())
                .build();
    }
}
