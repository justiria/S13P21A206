package com.aicontact.backend.dailySchedule.dto;

import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class DailyScheduleUpdateDto {
    private String title;
    private String memo;
    private LocalDateTime scheduleDate;
}

