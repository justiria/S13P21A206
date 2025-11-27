package com.aicontact.backend.dailySchedule.dto;

import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class DailyScheduleRequestDto {
    private LocalDateTime scheduleDate;
    private String title;
    private String memo;
}


