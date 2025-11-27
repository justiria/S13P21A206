import { useEffect, useState, useCallback, useMemo } from "react";
import { LetterApi } from "./index";
import type { BabyLetterResponse, LettersResponse } from "./response";

/** 
 * 로컬(프론트)에서 읽음 처리된 letter id를 보관 (계정별 분리 가능)
 * - 해시 기반(X) → id 기반(O)
 */

// const LETTER_SEENs_UPDATED = "letters-seen-updated";
// export {LETTER_SEENs_UPDATED};
export const LETTERS_SEEN_UPDATED = "letters-seen-updated";
export const LETTER_SEEN_UPDATED = LETTERS_SEEN_UPDATED;


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

function saveSeenIdSet(seen: Set<number>, userId?: string | number | null) {
  try {
    localStorage.setItem(SEEN_IDS_KEY(userId), JSON.stringify([...seen]));
  } catch {
    // ignore quota errors
  }
}

/** 서버에서 편지 목록(BabyLetterResponse[]) 가져오기 */
async function fetchLetters(): Promise<BabyLetterResponse[]> {
  const res = await LetterApi.getAll(); // ApiResponse<LettersResponse>
  if (!res.success || !Array.isArray(res.data)) return [];
  return res.data as LettersResponse;
}

/** 서버 isRead + 로컬 seenIds를 합쳐 실제 읽음 여부 판단 → 미읽음 개수 반환 */
async function getUnreadCountLocal(userId?: string | number | null) {
  const seen = getSeenIdSet(userId);
  const letters = await fetchLetters();
  let cnt = 0;
  for (const l of letters) {
    const locallyRead = seen.has(l.id);
    const isActuallyRead = l.isRead || locallyRead;
    if (!isActuallyRead) cnt++;
  }
  return cnt;
}

/** 로컬에서 '모두 읽음' 처리 (서버 상태는 변경 안 함) */
async function markAllAsReadLocal(userId?: string | number | null) {
  const seen = getSeenIdSet(userId);
  const letters = await fetchLetters();
  letters.forEach((l) => seen.add(l.id));
  saveSeenIdSet(seen, userId);
  window.dispatchEvent(new Event(LETTERS_SEEN_UPDATED));
}

/** 로컬에서 '단건 읽음' 처리 (본문 X, id O) */
function markOneAsReadLocal(letterId: number, userId?: string | number | null) {
  const seen = getSeenIdSet(userId);
  seen.add(letterId);
  saveSeenIdSet(seen, userId);
  window.dispatchEvent(new Event(LETTERS_SEEN_UPDATED));
}

export function effectiveLettersForUI(
  letters: BabyLetterResponse[],
  userId?: string | number | null
): BabyLetterResponse[] {
  const seen = getSeenIdSet(userId);
  return letters.map((l) => ({ ...l, isRead: l.isRead || seen.has(l.id) }));
  
}

/**
 * 미읽음 편지 개수 훅
 * - /summary/letters (BabyLetterResponse[]) 사용
 * - isRead(서버) + seenIds(로컬) 로 미읽음 계산
 * - pollMs: 폴링 주기(ms)
 * - userId: 로컬 저장 키를 계정별로 분리하고 싶을 때
 */
export function useUnreadLettersCount(options?: {
  pollMs?: number;
  userId?: string | number | null;
}) {
  const { pollMs, userId = null } = options || {};

  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setError(null);
      const c = await getUnreadCountLocal(userId);
      setCount(c);
    } catch {
      setError("안 읽은 편지 갯수를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await fetchCount();
    })();
    if (!pollMs) return;
    const id = setInterval(() => {
      if (mounted) fetchCount();
    }, pollMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [fetchCount, pollMs]);

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadLocal(userId);
    await fetchCount(); // 즉시 재계산
  }, [userId, fetchCount]);

  // ← 이제 id를 받는다!
  const markOneAsRead = useCallback(
    async (letterId: number) => {
      markOneAsReadLocal(letterId, userId);
      await fetchCount();
    },
    [userId, fetchCount]
  );

  const api = useMemo(
    () => ({
      markAllAsRead,
      markOneAsRead,
      refetch: fetchCount,
    }),
    [markAllAsRead, markOneAsRead, fetchCount]
  );

  return { count, loading, error, ...api };
}
