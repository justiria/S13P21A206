package com.aicontact.backend.user.dto;

import com.aicontact.backend.global.entity.enumeration.CoupleStatus;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class JoinDto {
    private String email;
    private String password;
    private String name;
    private MultipartFile file;
    private LocalDate birthDate;
    private CoupleStatus coupleStatus;
}


