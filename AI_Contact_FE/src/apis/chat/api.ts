
import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { ChatMessageRequest } from "./request";
import type { ChatMessageResponse } from "./response";

const BASE_PATH = "/chat";

export const ChatApi = {

  saveMessage: (payload: ChatMessageRequest) =>
    apiFetch<ApiResponse<void>>(`/message`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
 
  getMessages: (coupleId: number) =>
    apiFetch<ApiResponse<ChatMessageResponse[]>>(
      `${BASE_PATH}/${coupleId}/messages`
    ),

 
  
};
