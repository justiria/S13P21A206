import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { CoupleMatchingRequest, CoupleUpdateRequest  } from "./request";
import type {
  CoupleInfoResponse,
  CoupleJoinResponse,
  MyCodeResponse,
  PartnerInfoResponse,
} from "./response";

export const CouplesApi = {
  /* 인증 코드로 커플 연결 요청 */
  joinByCode: (code: string) =>
    apiFetch<ApiResponse<CoupleJoinResponse>>("/couples/join", {
      method: "POST",
      body: JSON.stringify({ verificationCode: code }),
    }),

  /* 커플 매칭 설정 */
  matching: (payload: CoupleMatchingRequest) =>
    apiFetch<ApiResponse<CoupleInfoResponse>>("/couples/matching", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* 내 커플 인증 코드 가져오기 */
  getMyCode: () => apiFetch<ApiResponse<MyCodeResponse>>("/couples/myCode"),

  /* 현재 커플 정보 가져오기 */
  getCoupleInfo: () => apiFetch<ApiResponse<CoupleInfoResponse>>("/couples"),

  /* 연인 정보 가져오기 */
  getPartnerInfo: () =>
    apiFetch<ApiResponse<PartnerInfoResponse>>("/couples/partner"),

  /* 커플 연결 해제 */
  deleteCouple: () =>
    apiFetch<ApiResponse<string>>("/couples", {
      method: "DELETE",
    }),
    
  /* 커플 정보 업데이트 */
  patchCouple: (payload : CoupleUpdateRequest) =>
    apiFetch<ApiResponse<string>>("/couples", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
