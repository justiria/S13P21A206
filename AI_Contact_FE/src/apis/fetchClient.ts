type ApiOptions = RequestInit & {
  auth?: boolean; // 기본 true: Authorization 헤더 자동 첨부
  asText?: boolean; // 응답을 text()로 받을 때
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;

function getToken() {
  return localStorage.getItem("accessToken");
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, headers, asText = false, ...rest } = options;

  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${API_PREFIX}${path}`;
  const h = new Headers(headers || {});
  h.set("Accept", "application/json");

  // JSON 바디 전송 시 content-type 자동 설정(이미 설정되어 있으면 유지)
  const isJsonBody =
    rest.body && !(rest.body instanceof FormData) && !h.has("Content-Type");
  if (isJsonBody) h.set("Content-Type", "application/json");

  if (auth) {
    const token = getToken();
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    method: rest.method || "GET",
    headers: h,
    // 세션/쿠키 기반이면 활성화:
    // credentials: "include",
    ...rest,
  });

  // 공통 에러 처리
  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    throw new Error("UNAUTHORIZED");
  }
  if (res.status === 403) {
    throw new Error("FORBIDDEN");
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP_${res.status}`);
  }

  if (asText) return (await res.text()) as unknown as T;

  // JSON 응답 가정
  return (await res.json()) as T;
}
