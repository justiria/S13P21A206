package com.aicontact.backend.user.controller;


import com.aicontact.backend.auth.jwt.JwtUtil;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.dto.JoinDto;
import com.aicontact.backend.user.dto.UpdateUserDto;
import com.aicontact.backend.user.dto.UpdateUserPasswordRequestDto;
import com.aicontact.backend.user.dto.UserDto;
import com.aicontact.backend.user.dto.UserResponseDto;
import com.aicontact.backend.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(
            value = "/sign-up",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE     // multipart/form-data 로 지정
    )
    public ResponseEntity<ApiResponse<UserResponseDto>> joinProcess(@ModelAttribute JoinDto joinDto){
        try {
            // 필수 입력 체크
            if (joinDto.getEmail() == null || joinDto.getPassword() == null
                    || joinDto.getName() == null || joinDto.getFile() == null) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, null));
            }

            UserResponseDto result = userService.joinProcess(joinDto);

            if (result == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new ApiResponse<>(false, null));
            }

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, result));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, null));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMyInfo(@RequestHeader("Authorization") String authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String token = authHeader.substring(7); // "Bearer " 제거
        String email = jwtUtil.getEmail(token); // JWT에서 이메일 추출
        UserDto userDto = userService.getUserByEmail(email);

        ApiResponse<UserDto> response = ApiResponse.success(userDto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMyInfo(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody UpdateUserDto dto) {
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false,null));
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.getEmail(token);

        UserDto updatedUser = userService.updateMyInfo(email, dto);
        return ResponseEntity.ok(ApiResponse.success(updatedUser));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<String>> deleteMyAccount(@RequestHeader("Authorization") String authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false,"잘못된 토큰 형식"));
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.getEmail(token);

        userService.deleteMyAccount(email);
        return ResponseEntity.ok(ApiResponse.success("회원 정보 삭제 완료"));
    }

    @PutMapping(
    value = "/me/profile-image",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<UserDto>> updateMyProfileImage(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart("file") MultipartFile file) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, null));
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.getEmail(token);

        UserDto updated = userService.updateProfileImage(email, file);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<String>> changeMyPassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateUserPasswordRequestDto req) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "잘못된 토큰 형식"));
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.getEmail(token);

        userService.updatePassword(email, req.getCurrentPassword(), req.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("비밀번호가 변경되었습니다."));
    }

}
