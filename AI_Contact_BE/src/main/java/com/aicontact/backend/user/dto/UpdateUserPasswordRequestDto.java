package com.aicontact.backend.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserPasswordRequestDto {
    private String currentPassword;
    private String newPassword;
}
