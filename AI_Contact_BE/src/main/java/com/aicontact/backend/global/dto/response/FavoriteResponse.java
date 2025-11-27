package com.aicontact.backend.global.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FavoriteResponse {
    private Long mediaId;
    private boolean isFavorite;
}
