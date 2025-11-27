package com.aicontact.backend.auth.dto;

import com.aicontact.backend.user.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final UserEntity userEntity;

    public CustomUserDetails(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한 시스템을 추후 사용할 경우에만 추가
        return new ArrayList<>();
    }

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        // 이메일을 로그인 ID로 사용
        return userEntity.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // 계정 만료 여부
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // 계정 잠김 여부
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // 비밀번호 만료 여부
    }

    @Override
    public boolean isEnabled() {
        return true;  // 계정 활성 여부
    }

    public UserEntity getUserEntity() {
        return userEntity; // 필요 시 원본 엔티티 접근용
    }
}
