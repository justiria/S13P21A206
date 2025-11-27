import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CouplesApi } from "../../apis/couple";
import { UsersApi } from "../../apis/user";
import type { MeUserResponse } from "../../apis/user/response";
import placeholderImg from "../../assets/images/symbol.svg";
import "../../styles/CoupleConnection.css";

export default function MyConnectionInfo() {
  const [verificationCode, setVerificationCode] = useState("");
  const [profileImageUrl, setProfileImageUrl] =
    useState<string>(placeholderImg);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("로그인이 필요합니다.");
        return;
      }

      try {
        const [meRes, codeRes] = await Promise.all([
          UsersApi.getMe({ signal: controller.signal }),
          CouplesApi.getMyCode(),
        ]);

        const me: MeUserResponse = meRes.data;
        const code = codeRes.data.verificationCode;
        

        // 커플 연결된 경우 진행 척도에 따라 리다이렉트
        if (me.coupleStatus === "COUPLED") {
          const coupleInfo = (await CouplesApi.getCoupleInfo()).data;
          if(coupleInfo.matchedAt == null || coupleInfo.coupleName == null){
            navigate("/additional-info", { replace: true });
          }
          else{
            navigate("/ai", { replace: true });
          }
          return;
        }

        setProfileImageUrl(me.profileImageUrl || placeholderImg);
        setVerificationCode(code ?? "");
        setErrorMsg("");
      } catch (e: any) {
        if (e.message === "UNAUTHORIZED") {
          localStorage.removeItem("accessToken");
          setErrorMsg("세션이 만료되었습니다. 다시 로그인해 주세요.");
        } else if (e.message === "FORBIDDEN") {
          setErrorMsg("접근 권한이 없습니다.");
        } else if (e.name !== "AbortError") {
          setErrorMsg("정보를 불러오는 중 오류가 발생했습니다.");
        }
        console.error(e);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  return (
    <div className="connection-container">
      <div className="profile-container">
        <img
          src={profileImageUrl}
          alt="프로필"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholderImg;
          }}
          className="avatar-img"
        />
      </div>

      <p className="code-label">당신의 코드</p>
      <p className="code">{verificationCode || "-"}</p>

      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

      <button>공유하기</button>
    </div>
  );
}
