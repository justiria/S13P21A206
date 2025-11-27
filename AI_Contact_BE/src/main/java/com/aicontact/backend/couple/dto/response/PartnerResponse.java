package com.aicontact.backend.couple.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerResponse {

    private Long id;
    private String name;
    private String email;
    private LocalDate birthDate;
    private String profileImageUrl;
}
