package com.aicontact.backend.babychat.controller;

import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.aiChild.service.AiChildService;
import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.babychat.dto.request.ChatRequestDTO;
import com.aicontact.backend.babychat.dto.response.ChatResponseDTO;
import com.aicontact.backend.babychat.entity.AiMessageType;
import com.aicontact.backend.babychat.entity.BabyChatMessage;
import com.aicontact.backend.babychat.repository.BabyChatMessageRepository;
import com.aicontact.backend.babychat.service.GmsChatService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/baby")
@RequiredArgsConstructor
public class BabyChatRestController {

    private final GmsChatService service;
    private final BabyChatMessageRepository repo;
    private final UserRepository userRepository;
    private final AiChildService aiChildService;
    private final UserService userService;

    @PostMapping(
            path = "/chat",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<ChatResponseDTO>> chat(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ChatRequestDTO req
    ) {


        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저 없음"));


        AiChildEntity aiChild = aiChildService.getMyChild(user.getCoupleId());

        BabyChatMessage userMsg = BabyChatMessage.builder()
                .user(user)
                .aiChild(aiChild)
                .aiMessageType(AiMessageType.USER)
                .content(req.getMessage())
                .conversationSessionId(req.getConversationSessionId())
                .build();
        repo.save(userMsg);


        List<BabyChatMessage> history = repo.findTop20ByUserIdAndConversationSessionIdOrderByCreatedAtDesc(
                userId, req.getConversationSessionId()
        );

        Collections.reverse(history);

        String babyReply = service.chatWithBaby(history, req.getMessage());

        BabyChatMessage aiMsg = BabyChatMessage.builder()
                .user(user)
                .aiChild(aiChild)
                .aiMessageType(AiMessageType.AI)
                .content(babyReply)
                .conversationSessionId(req.getConversationSessionId())
                .build();
        repo.save(aiMsg);

        ChatResponseDTO res = ChatResponseDTO.builder()
                .reply(babyReply)
                .conversationSessionId(req.getConversationSessionId())
                .timestamp(aiMsg.getCreatedAt())
                .aiMessageType(aiMsg.getAiMessageType())
                .build();

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, res));
    }


    @GetMapping(
            path = "/chat",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<ChatResponseDTO>>> getChatHistoryByUser(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();

        List<BabyChatMessage> messages = repo
                .findByUserIdOrderByCreatedAtAsc(userId);

        List<ChatResponseDTO> dtoList = messages.stream()
                .map(ChatResponseDTO::fromEntity)
                .toList();

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, dtoList));
    }

}
