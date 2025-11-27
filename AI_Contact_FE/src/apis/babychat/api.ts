import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { BabychatRequest } from "./request";
import type { BabychatResponse } from "./response";

const BASE_PATH = "/baby/chat";

export const babychatapi = {
  /* GMS에 메시지 전송 */
  sendMessage: (payload: BabychatRequest) =>
    apiFetch<ApiResponse<BabychatResponse>>(BASE_PATH, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* 특정 유저의 대화 내역 조회 */
  getMessages: (userId: number) =>
    apiFetch<ApiResponse<BabychatResponse[]>>(`${BASE_PATH}?userId=${userId}`),
};
