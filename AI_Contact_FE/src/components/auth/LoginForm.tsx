import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../../apis/auth";
import { UsersApi } from "../../apis/user";
import { normalizeToken } from "../../utils/token";
import { CouplesApi } from "../../apis/couple";

interface LoginFormProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const rawToken = await AuthApi.signIn({ email, password });
      const accessToken = normalizeToken(rawToken);
      if (!accessToken) throw new Error("토큰을 받지 못했습니다.");
      localStorage.setItem("accessToken", accessToken);

      const meRes = await UsersApi.getMe({
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      const me = meRes.data;
      console.log(meRes);
      console.log(me);
      if (me.coupleStatus === "COUPLED") {
        const myCoupleInfo = (await CouplesApi.getCoupleInfo()).data;
        if(myCoupleInfo.startDate == null || myCoupleInfo.coupleName == null){
          navigate("/additional-info", { replace: true });
        }
        else{
          navigate("/ai", { replace: true });
        }
      } else {
        navigate("/connection", { replace: true });
      }
    } catch (err: any) {
      alert(err.message || "로그인에 실패했습니다.");
      if (err.message?.includes("세션")) {
        localStorage.removeItem("accessToken");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="아이디"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "로그인 중..." : "로그인"}
      </button>
      <p className="toggle-text">
        아직 회원이 아니신가요? <span onClick={onToggle}>회원가입</span>
      </p>
    </form>
  );
}
