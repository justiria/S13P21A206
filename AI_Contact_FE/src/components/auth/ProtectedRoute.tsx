import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UsersApi } from "../../apis/user/api";

function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return !payload?.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      }
    );
  });
}

export default function ProtectedRoute() {
  const location = useLocation(); // ✅ 라우트 변경 감지
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);
  const [redirectReason, setRedirectReason] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token || isJwtExpired(token)) {
        localStorage.removeItem("accessToken");
        if (!cancelled) {
          setOk(false);
          setRedirectReason("token-expired");
          setLoading(false);
        }
        return;
      }

      try {
        console.log(location.pathname);
        const res = await withTimeout(UsersApi.getMe(), 5000);
        const me: any = (res as any)?.data;
        if (!cancelled) {
          if (me?.id) {
            setOk(true);
          } else {
            localStorage.removeItem("accessToken");
            setOk(false);
            setRedirectReason("unauthorized");
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        const status = err?.response?.status as number | undefined;
        if (status === 500) {
          localStorage.removeItem("accessToken");
          setOk(false);
          setRedirectReason("server-500");
        } else if (status === 401 || status === 403) {
          localStorage.removeItem("accessToken");
          setOk(false);
          setRedirectReason("unauthorized");
        } else if (err?.message === "timeout") {
          setOk(false);
          setRedirectReason("timeout");
        } else {
          setOk(false);
          setRedirectReason("unknown");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [location.key]);

  if (loading) return null;
  if (ok) return <Outlet />;
  return (
    <Navigate
      to="/auth"
      replace
      state={{ reason: redirectReason, from: location }}
    />
  );
}
