package com.aicontact.backend.nickname.controller;


import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.nickname.dto.NicknameRequestDto;
import com.aicontact.backend.nickname.dto.NicknameResponseDto;
import com.aicontact.backend.nickname.entity.NicknameEntity;
import com.aicontact.backend.nickname.service.NicknameService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/nicknames")
public class NicknameController {

    private final NicknameService nicknameService;

    @PostMapping
    public ResponseEntity<ApiResponse<NicknameResponseDto>> create(
            @RequestBody NicknameRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        NicknameEntity saved = nicknameService.create(dto.getWord(), dto.getDescription(), userDetails.getUsername());
        NicknameResponseDto result = NicknameResponseDto.fromEntity(saved);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NicknameResponseDto>>> getAll(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletResponse response
    ) {
        List<NicknameEntity> entities = nicknameService.getByCouple(userDetails.getUsername());

        // 1. 쿠키에 nickname 목록 저장
        String nicknameList = entities.stream()
                .map(NicknameEntity::getWord)
                .collect(Collectors.joining(","));  // 예: "공주,햄찌,자기야"

        Cookie cookie = new Cookie("nicknames", URLEncoder.encode(nicknameList, StandardCharsets.UTF_8));
        cookie.setPath("/");                // 모든 경로에서 접근 가능
        cookie.setHttpOnly(false);         // JS에서 접근 가능하게
        cookie.setMaxAge(60 * 60 * 24);    // 1일 유효
        response.addCookie(cookie);

        // 2. 응답 body
        List<NicknameResponseDto> result = entities.stream()
                .map(NicknameResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NicknameResponseDto>> update(
            @PathVariable Long id,
            @RequestBody NicknameRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        NicknameEntity entity = nicknameService.update(id, dto.getWord(), dto.getDescription(), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(NicknameResponseDto.fromEntity(entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        nicknameService.delete(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("닉네임이 성공적으로 삭제되었습니다."));
    }
}

