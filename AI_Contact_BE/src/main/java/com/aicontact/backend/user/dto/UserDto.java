package com.aicontact.backend.user.dto;

import com.aicontact.backend.global.entity.enumeration.CoupleStatus;
import com.aicontact.backend.user.entity.UserEntity;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String profileImageUrl;
    private LocalDate birthDate;
    private CoupleStatus coupleStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long coupleId;

    public UserDto(UserEntity entity) {
        this.id = entity.getId();
        this.email = entity.getEmail();
        this.name = entity.getName();
        this.profileImageUrl = entity.getProfileImageUrl();
        this.birthDate = entity.getBirthDate();
        this.coupleStatus = entity.getCoupleStatus();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
        this.coupleId = entity.getCoupleId();

    }

}
