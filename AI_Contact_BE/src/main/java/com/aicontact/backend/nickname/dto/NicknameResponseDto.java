package com.aicontact.backend.nickname.dto;

import com.aicontact.backend.nickname.entity.NicknameEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class NicknameResponseDto {

    private Long id;
    private String nickname;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static NicknameResponseDto fromEntity(NicknameEntity entity) {
        return NicknameResponseDto.builder()
                .id(entity.getId())
                .nickname(entity.getWord())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

