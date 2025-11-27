package com.aicontact.backend.couple.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class VerificationCodeRequest {
    private String verificationCode;
}
