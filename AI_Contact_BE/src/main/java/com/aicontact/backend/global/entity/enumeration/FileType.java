package com.aicontact.backend.global.entity.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum FileType {
    IMAGE("이미지"),
    VIDEO("비디오");

    private final String description;
}
