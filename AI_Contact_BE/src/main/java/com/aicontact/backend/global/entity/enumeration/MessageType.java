package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MessageType {
    USER("사용자"),
    AI("AI");

    private final String description;
}
