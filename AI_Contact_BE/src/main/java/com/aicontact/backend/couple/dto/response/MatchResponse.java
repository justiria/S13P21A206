package com.aicontact.backend.couple.dto.response;

import com.aicontact.backend.aiChild.dto.response.AiChildResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class MatchResponse {
    private final CoupleInfoResponse coupleInfo;
    private final AiChildResponse aiChild;
}
