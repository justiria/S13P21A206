import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { GetWebRtcTokenRequest } from "./request";
import type { GetWebRtcTokenResponse } from "./response";

export const WebRtcApi = {
  /* WebRTC 토큰 요청 API */
  getToken: (
    payload: GetWebRtcTokenRequest,
    accessToken: string
  ): Promise<ApiResponse<GetWebRtcTokenResponse>> =>
    apiFetch<ApiResponse<GetWebRtcTokenResponse>>("/calls/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
};
