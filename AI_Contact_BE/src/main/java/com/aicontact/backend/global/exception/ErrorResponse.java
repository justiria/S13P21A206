package com.aicontact.backend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 에러 응답 DTO
@Getter
@AllArgsConstructor
public class ErrorResponse {
    private final int status;
    private final String error;
    private final String message;
}
