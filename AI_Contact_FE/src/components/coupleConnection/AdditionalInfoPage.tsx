import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { CouplesApi } from "../../apis/couple"; // 예: getPartnerInfo()
import { UsersApi } from "../../apis/user";
import type { MeUserResponse } from "../../apis/user/response";
import heart from "../../assets/images/heart.png";
import placeholderImg from "../../assets/images/symbol.svg";
import { getBackgroundTaskPromise } from "../PromiseStore";
import { aiChildApi } from "../../apis/aiChild";
import { useNavigate } from "react-router-dom";
import Particles from "../auth/Particles";
import Loading from "../animations/Loading";
import { createPortal } from "react-dom";

import "../../styles/AdditionalInfo.css";

export interface formDataType {
  childName: string;
  coupleName: string;
  coupleDate: string; // YYYY-MM-DD
}

// YYYY-MM-DD 포맷 기본값
const todayISO = (() => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
})();

export default function AdditionalInfoPage() {
  const [formData, setFormData] = useState<formDataType>({
    childName: "",
    coupleName: "",
    coupleDate: todayISO,
  });

  const [isFinalizing, setIsFinalizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // 내/연인 프로필 이미지 상태
  const [profileImageUrl, setProfileImageUrl] =
    useState<string>(placeholderImg);
  const [partnerImageUrl, setPartnerImageUrl] =
    useState<string>(placeholderImg);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("로그인이 필요합니다.");
        setProfileImageUrl(placeholderImg);
        setPartnerImageUrl(placeholderImg);
        return;
      }

      try {
        await getBackgroundTaskPromise();
        const mePromise = UsersApi.getMe({ signal: controller.signal });
        const partnerPromise = CouplesApi.getPartnerInfo
          ? CouplesApi.getPartnerInfo()
          : Promise.resolve({ data: null as any });

        const [meRes, partnerRes] = await Promise.all([
          mePromise,
          partnerPromise,
        ]);

        const me: MeUserResponse = meRes.data;
        const myUrl = me?.profileImageUrl || placeholderImg;
        setProfileImageUrl(myUrl);

        const partnerUrl =
          (partnerRes as any)?.data?.profileImageUrl || placeholderImg;
        setPartnerImageUrl(partnerUrl);

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
        // 실패 시 안전 폴백
        setProfileImageUrl(placeholderImg);
        setPartnerImageUrl(placeholderImg);
      }
    };

    run();
    return () => controller.abort();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateChildInfoTask = async (childName: string) => {
    const aiInfo = await aiChildApi.getMyChildren();
    const childId = aiInfo.data.id;
    return aiChildApi.updateChild(childId, {
      name: childName,
      imageUrl: aiInfo.data.imageUrl,
      growthLevel: aiInfo.data.growthLevel,
      experiencePoints: aiInfo.data.experiencePoints,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const backgroundTaskPromise = getBackgroundTaskPromise();

    e.preventDefault();
    if (isFinalizing) return;

    setIsFinalizing(true);
    setErrorMsg("");

    if (!backgroundTaskPromise) {
      setErrorMsg("오류: 이전 단계의 작업이 시작되지 않았습니다.");
      setIsFinalizing(false);
      return;
    }

    try {
      // 1. 첫 번째 작업(매칭)이 완료될 때까지 기다림
      await backgroundTaskPromise;

      // 2. 두 번째 작업(커플 정보 수정) 실행
      await CouplesApi.patchCouple({
        coupleName: formData.coupleName,
        startDate: formData.coupleDate,
      });

      // 3. 세 번째 작업(아이 정보 수정) 실행
      await updateChildInfoTask(formData.childName);

      alert("연결 및 모든 설정이 완료되었습니다!");
      navigate("/ai"); // 최종 목적지로 이동
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "최종 설정 중 오류가 발생했습니다. 다시 시도해 주세요.";
      setErrorMsg(msg);
      console.error(err);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <>
      {isFinalizing &&
        createPortal(
          <div className="loading-background">
            <Particles
              particleColors={["#735AE1", "#A66EE0", "#ffffff"]}
              particleCount={300}
              particleSpread={10}
              speed={0.2}
              particleBaseSize={1000}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
              cameraDistance={10}
            />
            <Loading />
          </div>,
          document.body
        )}
      <div className="main-layout additional-info">
        <div className="left-layout">
          {/* 내 이미지 */}
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

          <img src={heart} className="rotating-heart" alt="" />

          {/* 연인 이미지 */}
          <div className="profile-container">
            <img
              src={partnerImageUrl}
              alt="연인 프로필"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = placeholderImg;
              }}
              className="avatar-img"
            />
          </div>
        </div>

        <div className="right-layout">
          <h3>연인 정보를 입력해주세요</h3>
          <form className="ai-form" onSubmit={handleSubmit}>
            <div>우리가 시작한 날이에요</div>
            <input
              type="date"
              name="coupleDate"
              value={formData.coupleDate}
              onChange={handleChange}
            />

            <div>우리 커플의 이름이에요</div>
            <input
              type="text"
              placeholder="커플명"
              name="coupleName"
              value={formData.coupleName}
              onChange={handleChange}
            />

            <div>우리 아이의 이름이에요</div>
            <input
              type="text"
              placeholder="아이명"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
            />

            <button type="submit">시작하기</button>
          </form>

          {errorMsg && (
            <p style={{ color: "crimson", marginTop: 12 }}>{errorMsg}</p>
          )}
        </div>
      </div>
    </>
  );
}
