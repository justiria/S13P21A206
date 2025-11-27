// src/apis/letter/generate.ts

export const LETTER_COOLDOWN_KEY = "lastLetterGeneratedAt";
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// 유저별 키 빌더 (보존)
const key = (userId?: number | string | null) =>
  userId != null ? `${LETTER_COOLDOWN_KEY}:u:${userId}` : LETTER_COOLDOWN_KEY;

/**
 * [COOLDOWN_OFF]
 * 쿨타임을 다시 켜고 싶으면 아래 두 함수는 그대로 두고,
 * generateLetter 안에서 주석 처리한 가드/저장 코드를 다시 활성화하세요.
 */

// 유저별 마지막 생성 시각 기준으로 오늘 생성 가능 여부
export function canGenerateToday(userId?: number | string | null): boolean {
  const last = Number(localStorage.getItem(key(userId)) || 0);
  return Date.now() - last > ONE_DAY_MS;
}

// 남은 시간 텍스트
export function remainText(userId?: number | string | null): string {
  const last = Number(localStorage.getItem(key(userId)) || 0);
  const diff = ONE_DAY_MS - (Date.now() - last);
  if (diff <= 0) return "";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}시간 ${String(m).padStart(2, "0")}분`;
}

export type GenerateLetterResult = {
  ok: boolean;
  body?: string;
  // [COOLDOWN_OFF] 타입은 유지(기존 코드 호환용). 필요없으면 "cooldown"을 제거해도 됨.
  reason?: "cooldown" | "no-token" | "bad-status" | "invalid-json" | "exception";
  status?: number;
};

/**
 * 편지 생성: (현재 쿨타임 미적용)
 * - [COOLDOWN_OFF] 주석 표시된 두 군데를 다시 켜면 쿨타임이 동작합니다.
 */
export async function generateLetter(options?: {
  silent?: boolean;
  timeoutMs?: number;
  userId?: number | string | null;
}): Promise<GenerateLetterResult> {
  const { timeoutMs = 6500 , userId } = options || {};

  // [COOLDOWN_OFF] 생성 차단 가드 — 쿨타임 켜려면 주석 해제
  if (!canGenerateToday(userId)) return { ok: false, reason: "cooldown" };

  const token = localStorage.getItem("accessToken");
  if (!token) return { ok: false, reason: "no-token" };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort("client-timeout"), timeoutMs);

  try {
    const url =
      `${import.meta.env.VITE_API_BASE_URL}` +
      `${import.meta.env.VITE_API_PREFIX}` +
      `/summary/letter`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
    });
    if (!res.ok) return { ok: false, reason: "bad-status", status: res.status };

    const json = (await res.json()) as { success?: boolean; data?: string };
    if (json?.success && typeof json.data === "string") {
      // [COOLDOWN_OFF] 성공 시 쿨타임 기록 — 다시 켜려면 주석 해제
      localStorage.setItem(key(userId), String(Date.now()));
      return { ok: true, body: json.data };
    }
    return { ok: false, reason: "invalid-json" };
  } catch {
    return { ok: false, reason: "exception" };
  } finally {
    clearTimeout(timer);
  }
}
