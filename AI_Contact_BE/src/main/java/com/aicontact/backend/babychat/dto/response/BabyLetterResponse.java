package com.aicontact.backend.babychat.dto.response;

import com.aicontact.backend.babychat.entity.BabyLetter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BabyLetterResponse {

    private Long id;

    private String content;

    private Boolean isRead;

    // BabyLetter 엔티티에서 DTO로 변환하는 정적 메서드
    public static BabyLetterResponse from(BabyLetter letter) {
        return BabyLetterResponse.builder()
                .id(letter.getId())
                .content(letter.getLetterContent())
                .isRead(letter.getIsRead())
                .build();
    }
}