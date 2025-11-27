/**
 * 로컬 스토리지 등에 저장된 액세스 토큰 문자열을 정제하여 반환
 * - 앞뒤 쌍따옴표 제거
 * - "Bearer " 접두어 제거
 */
export function normalizeToken(raw: string): string {
  return raw
    .trim()
    .replace(/^"+|"+$/g, "") // 앞뒤 " 제거
    .replace(/^Bearer\s+/i, ""); // Bearer 접두사 제거
}
