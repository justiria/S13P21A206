package com.aicontact.backend.comicStrips.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateComicStripsRequest {
    private String location;
    private String activity;
    private String weather;
}
