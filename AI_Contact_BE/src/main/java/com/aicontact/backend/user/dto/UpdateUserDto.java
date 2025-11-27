package com.aicontact.backend.user.dto;

import com.aicontact.backend.global.entity.enumeration.CoupleStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDto {

    private String name;
    private String profileImageUrl;
    private CoupleStatus coupleStatus;

}

