package com.aicontact.backend.couple.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Setter
public class CoupleUpdateRequest {
    private LocalDate startDate;   // nullable
    private String coupleName;     // nullable
}
