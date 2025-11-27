package com.aicontact.backend.couple.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class CoupleMatchingRequest {
    private Long partnerId;
    private LocalDate startDate;    // nullable
    private String coupleName;      // nullable
}
