import type { SignInRequest } from "./request";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;

export const AuthApi = {
  /* 로그인 요청 */
  signIn: async (payload: SignInRequest): Promise<string> => {
    const url = `${BASE_URL}${API_PREFIX}/auth/sign-in`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain, application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      let msg = "로그인 실패";
      if (ct.includes("application/json")) {
        const data = await res.json().catch(() => null);
        if (data?.message) msg = data.message;
      }
      throw new Error(msg);
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      return data.accessToken ?? data.token ?? "";
    } else {
      const raw = await res.text();
      return raw;
    }
  },
};
