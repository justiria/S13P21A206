import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { SignUpRequest } from "./request";
import type { MeUserResponse } from "./response";

export const UsersApi = {
  /* 현재 로그인한 사용자 정보 조회 */
  getMe: (options?: RequestInit) =>
    apiFetch<ApiResponse<MeUserResponse>>("/users/me", options),

  /* 회원가입 */
  signUp: (payload: SignUpRequest) => {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("name", payload.name);
    formData.append("birthDate", payload.birthDate);
    formData.append("file", payload.file);

    return apiFetch<ApiResponse<void>>("/users/sign-up", {
      method: "POST",
      body: formData,
    });
  },

  /* 회원 탈퇴 */
  deleteMe: () =>
    apiFetch<ApiResponse<string>>("/users/me", {
      method: "DELETE",
    }),

  /* 프로필 이미지 업데이트 (multipart/form-data) */
  updateProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<ApiResponse<MeUserResponse>>("/users/me/profile-image", {
      method: "PUT",
      body: formData,
    });
  },

  /* 비밀번호 업데이트 */
  updatePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiFetch<ApiResponse<string>>("/users/me/password", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
