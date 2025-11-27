// import { apiFetch } from "../fetchClient";
// import type { ApiResponse } from "../types/common";
// import type { LettersResponse } from "./response";

// export const LetterApi = {
//   getAll: () =>
//     apiFetch<ApiResponse<LettersResponse>>(`/summary/letters`),



//   create: () => apiFetch<ApiResponse<string>>("/summary/letter", { method: "GET" }),

//   unreadCount: () =>
//     apiFetch<ApiResponse<number>>(`/summary/letters/unread-count`),

//   markAsRead: async (letterId: number) => {
//     return await apiFetch(`/summary/letters/${letterId}/read`, {
//       method: 'PATCH'
//     });
//   }
// };

import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { LettersResponse } from "./response";

// ⬇ 로컬 저장된 읽음 id 유틸
const SEEN_IDS_KEY = (userId?: string | number | null) =>
  userId != null ? `lettersSeenIds:u:${userId}` : `lettersSeenIds`;

function getSeenIdSet(userId?: string | number | null): Set<number> {
  try {
    const raw = localStorage.getItem(SEEN_IDS_KEY(userId));
    if (!raw) return new Set<number>();
    return new Set<number>(JSON.parse(raw) as number[]);
  } catch {
    return new Set<number>();
  }
}

function applyEffectiveIsRead(
  letters: LettersResponse,
  userId?: string | number | null
): LettersResponse {
  const seen = getSeenIdSet(userId);
  return letters.map(l => ({ ...l, isRead: l.isRead || seen.has(l.id) }));
}

export const LetterApi = {
  // ⬇ getAll을 래핑해서 항상 '표시용 isRead'로 보정
  getAll: async (userId: string | number | null = null) => {
    const res = await apiFetch<ApiResponse<LettersResponse>>(`/summary/letters`);
    if (res.success && Array.isArray(res.data)) {
      const data = applyEffectiveIsRead(res.data, userId);
      return { ...res, data };
    }
    return res;
  },

  create: () => apiFetch<ApiResponse<string>>("/summary/letter", { method: "GET" }),

  unreadCount: () =>
    apiFetch<ApiResponse<number>>(`/summary/letters/unread-count`),

  markAsRead: async (letterId: number) => {
    return await apiFetch(`/summary/letters/${letterId}/read`, {
      method: "PATCH",
    });
  },
};
