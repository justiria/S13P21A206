import { useNavigate } from "react-router-dom";
import TalkIcon from "../assets/icons/TalkIcon.svg?react";
import "../styles/BabyAvatar.css";

interface BabyAvatarProps {
  name: string;
  imageUrl: string;
  canGrow?: boolean;
  onGrowClick?: () => void;
  imgVersion?: number;
  isProcessing?: boolean; // 처리 중 여부
}

export default function BabyAvatar({
  name,
  imageUrl,
  canGrow = false,
  onGrowClick,
  imgVersion = 1,
  isProcessing = false, // 기본 false
}: BabyAvatarProps) {
  const navigate = useNavigate();

  const cacheBustedSrc =
    imageUrl + (imageUrl.includes("?") ? "&" : "?") + `v=${imgVersion}`;

  return (
    <div className="baby-container">
      {canGrow ? <div className="grow-wrapper"></div> : <></>}
      <div className="baby-avatar-wrapper">
        <h1 className="baby-name">{name}</h1>

        <div className="image-wrapper">
          <img
            key={imgVersion}
            src={cacheBustedSrc}
            alt={name}
            className="baby-image"
          />

          {canGrow ? (
            <button
              className={`talk-button grow-button ${
                isProcessing ? "disabled" : ""
              }`} // 스타일링용 클래스
              onClick={isProcessing ? undefined : onGrowClick} // 처리 중엔 클릭 막기
              disabled={isProcessing}
            >
              {isProcessing ? "성장 중..." : "🌱 성장하기"}
            </button>
          ) : (
            <div className="talk-button" onClick={() => navigate("/talk")}>
              <TalkIcon />
              <div>이야기하기</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
