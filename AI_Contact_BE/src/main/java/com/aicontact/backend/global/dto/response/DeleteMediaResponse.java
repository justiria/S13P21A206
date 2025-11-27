package com.aicontact.backend.global.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeleteMediaResponse {
    private String message;
    private Long deletedMediaId;
}
