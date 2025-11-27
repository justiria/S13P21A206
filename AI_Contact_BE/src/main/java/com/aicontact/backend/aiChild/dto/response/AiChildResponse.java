package com.aicontact.backend.aiChild.dto.response;

import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@Getter
public class AiChildResponse {
    private Long   id;
    private String name;
    private String imageUrl;
    private Integer growthLevel;
    private Integer experiencePoints;
    public AiChildResponse(AiChildEntity e) {
        this.id               = e.getId();
        this.name             = e.getName();
        this.imageUrl         = e.getImageUrl();
        this.growthLevel      = e.getGrowthLevel();
        this.experiencePoints = e.getExperiencePoints();
    }
}
