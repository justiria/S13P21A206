package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CoupleStatus {
    SINGLE("싱글"),
    PENDING("매칭 대기중"),
    COUPLED("커플");

    private final String description;
}
