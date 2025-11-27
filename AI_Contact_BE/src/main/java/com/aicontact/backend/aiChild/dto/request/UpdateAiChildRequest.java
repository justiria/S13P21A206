package com.aicontact.backend.aiChild.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAiChildRequest {
    private String name;
    private String imageUrl;
    private Integer growthLevel;
    private Integer experiencePoints;
}
