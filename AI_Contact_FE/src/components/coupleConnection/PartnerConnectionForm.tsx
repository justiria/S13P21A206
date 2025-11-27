import { useState } from "react";
import { CouplesApi } from "../../apis/couple";
import heart from "../../assets/images/heart.png";
import "../../styles/CoupleConnection.css";
import { setBackgroundTaskPromise } from "../PromiseStore";

import type React from "react";
import { useNavigate } from "react-router-dom";

export default function PartnerConnectionForm() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [isStarting, setIsStarting] = useState(false); // 초기 버튼 클릭 시 로딩 상태

  const matchingTask = async (partnerId : number) => {
    const matchingResult = await CouplesApi.matching({ partnerId });
    return matchingResult;
  };

  const handleStartConnection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isStarting) return;

    setIsStarting(true);
    setErrorMsg("");

    try { 
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const joinRes = await CouplesApi.joinByCode(code.trim());
      const join = joinRes.data;

      if (!join.matched || !join.partnerId) {
        throw new Error("매칭할 수 없습니다. 상대의 상태를 확인해 주세요.");
      }

      // 성공 시, 백그라운드 작업을 시작하고 Promise를 ref에 저장
      console.log("백그라운드 작업 시작!");
      setBackgroundTaskPromise(matchingTask(join.partnerId));
      
      navigate("/additional-info");

    } catch (err: unknown) {
      const msg = 
          err instanceof Error
          ? err.message
          : "잘못된 코드입니다. 다시 확인해 주세요.";
      setErrorMsg(msg);
      console.error(e);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <form className="connection-container" onSubmit={handleStartConnection}>
      <div className="heart">
        <img src={heart} alt="heart" />
      </div>

      <p className="code-label">연인의 커플 코드를 입력해 주세요.</p>
      <input
        type="text"
        placeholder="코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />

      <button type="submit" disabled={isStarting}>
        {isStarting ? "연결 중..." : "연결하기"}
      </button>

      {errorMsg && <p className="error-message">{errorMsg}</p>}
    </form>
  );
}
