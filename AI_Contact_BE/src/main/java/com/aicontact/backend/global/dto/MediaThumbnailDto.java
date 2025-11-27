package com.aicontact.backend.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MediaThumbnailDto {
    private Long id;
    private String thumbnailUrl;
    private boolean isFavorite;
    private LocalDateTime createdAt;
}
