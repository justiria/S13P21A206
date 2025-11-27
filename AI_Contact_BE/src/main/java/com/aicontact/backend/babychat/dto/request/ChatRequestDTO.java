package com.aicontact.backend.babychat.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatRequestDTO {
    private Long aiChildrenId;
    private String conversationSessionId;
    private String message;
}
