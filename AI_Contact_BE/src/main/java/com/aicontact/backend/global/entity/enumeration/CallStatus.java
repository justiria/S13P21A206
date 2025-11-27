package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CallStatus {
    INITIATED("통화 시작"),
    CONNECTED("연결됨"),
    ENDED("종료됨"),
    FAILED("실패");

    private final String description;
}