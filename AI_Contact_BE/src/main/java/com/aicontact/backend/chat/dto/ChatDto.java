package com.aicontact.backend.chat.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatDto {
    private Long coupleId;
    private Long senderId;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")  // 받을 때만
    private LocalDateTime sentAt;

    // 응답용 별도 필드 추가
    @JsonProperty("sentAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'+09:00'", timezone = "Asia/Seoul")
    public LocalDateTime getSentAtFormatted() {
        return sentAt;
    }
}