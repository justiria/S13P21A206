package com.aicontact.backend.couple.controller;

import com.aicontact.backend.aiChild.dto.response.AiChildResponse;
import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.aiChild.service.AiChildService;
import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.couple.dto.request.CoupleMatchingRequest;
import com.aicontact.backend.couple.dto.request.CoupleUpdateRequest;
import com.aicontact.backend.couple.dto.request.VerificationCodeRequest;
import com.aicontact.backend.couple.dto.response.*;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.service.CoupleService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/couples")
@RequiredArgsConstructor
public class CoupleController {
    private final UserService userService;
    private final CoupleService coupleService;
    private final AiChildService aiChildService;

    @PostMapping("/join")
    public ResponseEntity<ApiResponse<CoupleResponse>> join(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody VerificationCodeRequest req) {

        String myEmail = userDetails.getUserEntity().getEmail();
        Long myId = userService.getUserByEmail(myEmail).getId();

        CoupleResponse resp = coupleService.joinByCode(myId, req.getVerificationCode());

        if (!resp.isMatched()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(false, resp));
        }
        ApiResponse<CoupleResponse> response = ApiResponse.success(resp);
        return ResponseEntity.ok(response);
    }

    @Transactional
    @PostMapping("/matching")
    public ResponseEntity<ApiResponse<MatchResponse>> matchCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CoupleMatchingRequest req) {

        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();
        CoupleEntity resp = coupleService.createCouple(userId, req);

        try {
            AiChildEntity childResp = aiChildService.createChildForCouple(resp);
            MatchResponse matchResp = new MatchResponse(new CoupleInfoResponse(resp), new AiChildResponse(childResp));
            ApiResponse<MatchResponse> response = ApiResponse.success(matchResp);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            throw new RuntimeException(
                    "AI 아이 생성 중 오류가 발생했습니다: " + e.getMessage(),
                    e
            );
        }
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<CoupleInfoResponse>> getCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();
        CoupleInfoResponse resp = coupleService.getCoupleInfo(userId);
        ApiResponse<CoupleInfoResponse> response = ApiResponse.success(resp);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("")
    public ResponseEntity<ApiResponse<String>> deleteCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();
        coupleService.deleteCouple(userId);
        return ResponseEntity.ok(ApiResponse.success("커플 정보 삭제 완료"));
    }

    @PatchMapping("")
    public ResponseEntity<ApiResponse<CoupleInfoResponse>> patchCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CoupleUpdateRequest req) {

        Long userId = userService.getUserByEmail(userDetails.getUsername()).getId();
        CoupleInfoResponse resp = coupleService.updateCoupleInfo(userId, req);
        ApiResponse<CoupleInfoResponse> response = ApiResponse.success(resp);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/myCode")
    public ResponseEntity<ApiResponse<VerificationCodeResponse>> getMyCode(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();

        VerificationCodeResponse resp = coupleService.getMyCode(userId);
        ApiResponse<VerificationCodeResponse> response = ApiResponse.success(resp);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/partner")
    public ResponseEntity<ApiResponse<PartnerResponse>> getPartnerInfo(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();

        PartnerResponse partnerInfo = coupleService.getPartnerInfo(userId);
        return ResponseEntity.ok(ApiResponse.success(partnerInfo));
    }

}
