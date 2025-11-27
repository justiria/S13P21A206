import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { NicknameRequest } from "./request";
import type {
  NicknameCreateResponse,
  NicknameListResponse,
  NicknameUpdateResponse,
} from "./response";

export const NicknameApi = {
  // 전체 닉네임 조회
  getAll: () => apiFetch<ApiResponse<NicknameListResponse>>("/nicknames"),

  // 닉네임 등록
  create: (payload: NicknameRequest) =>
    apiFetch<ApiResponse<NicknameCreateResponse>>("/nicknames", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // 닉네임 수정
  update: (id: number, payload: NicknameRequest) =>
    apiFetch<ApiResponse<NicknameUpdateResponse>>(`/nicknames/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  delete: (id: number) =>
    apiFetch<void>(`/nicknames/${id}`, {
      method: "DELETE",
    }),
};
