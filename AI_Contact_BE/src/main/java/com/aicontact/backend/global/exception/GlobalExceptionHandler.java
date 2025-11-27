package com.aicontact.backend.global.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1) EntityNotFoundException 발생 시 이 메서드가 호출됩니다.
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        // 2) 원하는 형태의 바디를 정의
        ErrorResponse body = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "리소스를 찾을 수 없습니다.",
                ex.getMessage()
        );
        // 3) 404 상태와 바디 응답
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }


}
