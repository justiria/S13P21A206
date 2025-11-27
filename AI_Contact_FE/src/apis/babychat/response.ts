import type { AiMessageType } from "./types";

export type BabychatResponse = {
  reply: string;
  conversationSessionId: string;
  timestamp: string;
  aiMessageType: AiMessageType;
};
