package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ChatMessageType {
    TEXT("텍스트"),
    IMAGE("이미지");

    private final String description;
}
