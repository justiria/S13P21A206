package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CallType {
    VOICE("음성 통화"),
    VIDEO("화상 통화");

    private final String description;
}
