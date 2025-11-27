package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MatchingCodeStatus {
    ACTIVE("활성"),
    MATCHED("매칭 완료"),
    EXPIRED("만료됨");

    private final String description;
}