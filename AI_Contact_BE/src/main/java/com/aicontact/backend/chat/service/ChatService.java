package com.aicontact.backend.chat.service;

import com.aicontact.backend.chat.dto.ChatDto;
import com.aicontact.backend.chat.entity.Chat;
import com.aicontact.backend.chat.repository.ChatRepository;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final CoupleRepository coupleRepository;
    private final ChatRepository chatRepository;

    public void saveAndSend(ChatDto dto) {
        UserEntity sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid sender ID"));
        CoupleEntity couple = coupleRepository.findById(dto.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid couple ID"));

        Chat chat = new Chat();
        chat.setContent(dto.getContent());
        chat.setSender(sender);
        chat.setCouple(couple);
        chat.setSentAt(LocalDateTime.now());

        chatRepository.save(chat);

        ChatDto response = new ChatDto(
                dto.getCoupleId(),
                dto.getSenderId(),
                dto.getContent(),
                chat.getSentAt()
        );

        messagingTemplate.convertAndSend("/sub/chat/" + dto.getCoupleId(), response);
    }

    public List<Chat> getChatMessagesByCoupleId(Long coupleId) {
        return chatRepository.findByCoupleIdOrderBySentAtAsc(coupleId);
    }

}
