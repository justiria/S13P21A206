package com.aicontact.backend.comicStrips.dto.response;

import com.aicontact.backend.comicStrips.entity.ComicStripsEntity;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@Getter
public class ComicStripsResponse {
    private Long id;
    private String imageUrl;

    public ComicStripsResponse(ComicStripsEntity e) {
        this.id = e.getId();
        this.imageUrl = e.getImageUrl();
    }
}
