package com.aicontact.backend.comicStrips.dto.response;

import java.time.LocalDateTime;

import com.aicontact.backend.comicStrips.entity.ComicStripsEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ComicStripsListResponse {
    private Long id;
    private String imageUrl;
    private String title;
    private LocalDateTime createdAt;

    public ComicStripsListResponse(ComicStripsEntity e) {
        this.id = e.getId();
        this.imageUrl = e.getImageUrl();
        this.title = e.getTitle();
        this.createdAt = e.getCreatedAt(); // BaseTimeEntity에서 상속받음
    }
}
