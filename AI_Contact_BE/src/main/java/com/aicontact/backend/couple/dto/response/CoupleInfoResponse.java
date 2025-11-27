package com.aicontact.backend.couple.dto.response;

import com.aicontact.backend.couple.entity.CoupleEntity;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class CoupleInfoResponse {
    private Long coupleId;
    private Long user1Id;
    private Long user2Id;
    private LocalDateTime matchedAt;
    private LocalDate startDate;
    private String      coupleName;

    public CoupleInfoResponse(CoupleEntity c) {
        this.coupleId   = c.getId();
        this.user1Id    = c.getUser1().getId();
        this.user2Id    = c.getUser2().getId();
        this.matchedAt  = c.getMatchedAt();
        this.startDate  = c.getStartDate();
        this.coupleName = c.getCoupleName();
    }

}
