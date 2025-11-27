package com.aicontact.backend.user.service;


import java.io.IOException;
import java.security.SecureRandom;
import java.util.UUID;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aicontact.backend.global.entity.enumeration.CoupleStatus;
import com.aicontact.backend.global.storage.S3StorageService;
import com.aicontact.backend.user.dto.JoinDto;
import com.aicontact.backend.user.dto.UpdateUserDto;
import com.aicontact.backend.user.dto.UserDto;
import com.aicontact.backend.user.dto.UserResponseDto;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final S3StorageService s3StorageService;

    public UserResponseDto joinProcess(JoinDto joinDto) throws IOException {
        String email = joinDto.getEmail();
        String password = joinDto.getPassword();
        String name = joinDto.getName();


        if (userRepository.existsByEmail(email)) {
            return null;
        }

        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(password));
        user.setName(name);
        user.setCoupleStatus(joinDto.getCoupleStatus() != null ? joinDto.getCoupleStatus() : CoupleStatus.SINGLE);
        user.setBirthDate(joinDto.getBirthDate());

        MultipartFile file = joinDto.getFile();
        String ext      = getExtension(file.getOriginalFilename());
        String uuid     = UUID.randomUUID().toString();
        String key      = String.format("media/profile/%s.%s", uuid, ext);

        // 2) 원본 업로드
        String fileUrl = s3StorageService.upload(file, key);

        user.setProfileImageUrl(fileUrl);

        // 3) 랜덤 코드 생성 & 중복 방지
        String code;
        do {
            code = SecureRandomCodeGenerator.generateCode();
        } while (userRepository.existsByVerificationCode(code));
        user.setVerificationCode(code);

        userRepository.save(user);

        return new UserResponseDto(user.getId(),user.getName(),user.getEmail());
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    public UserDto getUserByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return new UserDto(user);
    }

    public UserDto updateMyInfo(String email, UpdateUserDto dto) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getProfileImageUrl() != null) user.setProfileImageUrl(dto.getProfileImageUrl());
        if (dto.getCoupleStatus() != null) user.setCoupleStatus(dto.getCoupleStatus());

        UserEntity updated = userRepository.save(user);

        return new UserDto(updated);
    }

    public void deleteMyAccount(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user);
    }


    public static class SecureRandomCodeGenerator {
        private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static final SecureRandom random = new SecureRandom();

        public static String generateCode() {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                int index = random.nextInt(CHARACTERS.length());
                sb.append(CHARACTERS.charAt(index));
            }
            return sb.toString();
        }
    }

    public UserDto updateProfileImage(String email, MultipartFile file) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        try {
            String ext = getExtension(file.getOriginalFilename());
            String uuid = UUID.randomUUID().toString();
            String key  = String.format("media/profile/%s.%s", uuid, ext);

            String fileUrl = s3StorageService.upload(file, key); // 이미 가입 로직에서 쓰던 메서드와 동일

            user.setProfileImageUrl(fileUrl);
            userRepository.save(user);

            return new UserDto(user);
        } catch (IOException e) {
            throw new RuntimeException("프로필 이미지 업로드 실패", e);
        }
    }

    public void updatePassword(String email, String currentPassword, String newPassword) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 현재 비밀번호 확인
        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 정책 검증: 길이/문자조합 등
        // if (newPassword == null || newPassword.length() < 8) {
        //     throw new RuntimeException("새 비밀번호는 8자 이상이어야 합니다.");
        // }

        // 저장
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
