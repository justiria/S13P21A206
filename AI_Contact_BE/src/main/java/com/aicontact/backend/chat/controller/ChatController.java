package com.aicontact.backend.chat.controller;
import com.aicontact.backend.chat.dto.ChatDto;
import com.aicontact.backend.chat.entity.Chat;
import com.aicontact.backend.chat.service.ChatService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat/sendMessage")
    public void sendMessage(ChatDto dto) {
        System.out.println("💬 coupleId: " + dto.getCoupleId());
        System.out.println("💬 senderId: " + dto.getSenderId());
        chatService.saveAndSend(dto);
    }

    @GetMapping("/{coupleId}/messages")
    public ResponseEntity<ApiResponse<List<Chat>>> getChatMessages(@PathVariable("coupleId") Long coupleId) {
        List<Chat> messages = chatService.getChatMessagesByCoupleId(coupleId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }
}
