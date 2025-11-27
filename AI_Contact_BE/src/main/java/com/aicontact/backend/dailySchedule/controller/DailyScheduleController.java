package com.aicontact.backend.dailySchedule.controller;

import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.couple.service.CoupleService;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleRequestDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleResponseDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleUpdateDto;
import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import com.aicontact.backend.dailySchedule.service.DailyScheduleService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class DailyScheduleController {

    private final DailyScheduleService dailyScheduleService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<DailyScheduleResponseDto>> createSchedule(
            @RequestBody @Valid DailyScheduleRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();
        Long userId = userService.getUserByEmail(myEmail).getId();

        DailyScheduleEntity saved = dailyScheduleService.createSchedule(
                coupleId,
                userId,
                dto.getScheduleDate(),
                dto.getTitle(),
                dto.getMemo()
        );
        return ResponseEntity.ok(ApiResponse.success(DailyScheduleResponseDto.fromEntity(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DailyScheduleResponseDto>> updateSchedule(
            @PathVariable("id") Long id,
            @RequestBody DailyScheduleUpdateDto dto) {
        DailyScheduleEntity updated = dailyScheduleService.updateSchedule(id, dto.getTitle(), dto.getMemo(), dto.getScheduleDate());
        return ResponseEntity.ok(ApiResponse.success(DailyScheduleResponseDto.fromEntity(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSchedule(@PathVariable("id") Long id) {
        dailyScheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("일정이 성공적으로 삭제되었습니다."));
    }

    @GetMapping("/day")
    public ResponseEntity<ApiResponse<List<DailyScheduleResponseDto>>> getDailySchedules(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {

        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        LocalDateTime startDate = date.toLocalDate().atStartOfDay();
        LocalDateTime endDate = date.toLocalDate().atTime(LocalTime.of(23,59));

        List<DailyScheduleResponseDto> result = dailyScheduleService.getSchedulesByDate(coupleId, startDate, endDate).stream()
                .map(DailyScheduleResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/month")
    public ResponseEntity<ApiResponse<List<DailyScheduleResponseDto>>> getMonthlySchedules(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("year") int year,
            @RequestParam("month") int month) {

        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        LocalDate firstDayOfMonth = LocalDate.of(year, month, 1).minusMonths(1);
        LocalDate lastDayOfMonth = LocalDate.of(year, month, 1).plusMonths(1).with(TemporalAdjusters.lastDayOfMonth());

        LocalDateTime start = firstDayOfMonth.atStartOfDay();
        LocalDateTime end = lastDayOfMonth.atTime(23, 59, 59);

        List<DailyScheduleResponseDto> result = dailyScheduleService.getSchedulesByMonth(coupleId, start, end).stream()
                .map(DailyScheduleResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/dday")
    public ResponseEntity<ApiResponse<List<DailyScheduleResponseDto>>> getDdaySchedules(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        LocalDateTime dateCriteria = LocalDateTime.now();

        List<DailyScheduleResponseDto> result = dailyScheduleService.getSchedulesDday(coupleId, dateCriteria).stream()
                .map(DailyScheduleResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
