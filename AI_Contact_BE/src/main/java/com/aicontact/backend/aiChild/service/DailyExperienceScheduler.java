package com.aicontact.backend.aiChild.service;

import com.aicontact.backend.aiChild.repository.AiChildRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DailyExperienceScheduler {
    private final AiChildRepository repo;

    // 매일 0시(서버 로컬 타임존 기준)에 실행
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    @Transactional
    public void grantDailyExperience() {
        int updatedCount = repo.incrementDailyExperience();
        // (선택) 로그 찍기
        System.out.println("하루 경험치 자동 부여 완료: " + updatedCount + "건");
    }
}
