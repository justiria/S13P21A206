package com.aicontact.backend.couple.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CoupleResponse {
    private boolean matched;
    private Long partnerId;
}
