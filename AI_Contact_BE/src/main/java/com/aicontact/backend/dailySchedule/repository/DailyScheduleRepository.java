package com.aicontact.backend.dailySchedule.repository;

import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import com.aicontact.backend.couple.entity.CoupleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DailyScheduleRepository extends JpaRepository<DailyScheduleEntity, Long> {

    // 특정 커플의 일정 중 하루에 해당하는 일정 전부 조회
    List<DailyScheduleEntity> findByCoupleAndScheduleDate(CoupleEntity couple, LocalDateTime scheduleDate);

    List<DailyScheduleEntity> findByCoupleAndScheduleDateBetweenOrderByScheduleDateAsc(CoupleEntity couple, LocalDateTime start, LocalDateTime end);

    List<DailyScheduleEntity> findTop5ByCoupleAndScheduleDateGreaterThanEqualOrderByScheduleDateAsc(CoupleEntity couple, LocalDateTime givenDate);
}

