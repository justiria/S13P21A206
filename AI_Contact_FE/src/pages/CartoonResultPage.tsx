import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ComicStripsApi } from "../apis/comicStrips";
import downloadbtn from "../assets/icons/downloadbtn.svg";
import WhiteLeftArrow from "../assets/icons/WhiteLeftArrow.svg";
import backgroundImage from "../assets/images/Cartoon.png";
import Sidebar from "../components/Sidebar";

import "../styles/CartoonPage.css";
import "../styles/CartoonResultPage.css";
import "../styles/MainPages.css";

export default function CartoonResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { imageUrl, id } = location.state || {};
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!imageUrl || !id) {
    return (
      <div>
        잘못된 접근입니다.{" "}
        <button onClick={() => navigate("/ai")}>홈으로</button>
      </div>
    );
  }

  const handleSaveTitle = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      await ComicStripsApi.updateTitle(id, { title });
      alert("제목이 저장되었습니다!");
    } catch (error) {
      console.error(error);
      alert("제목 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `comic_${id}.png`; // 저장될 파일명
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="cartoonresult-content">
        <img
          src={WhiteLeftArrow}
          alt="뒤로가기"
          className="left-arrow"
          onClick={() => navigate("/cartoon")}
        ></img>
        <img src={backgroundImage} alt="배경" className="resbackground-img" />
        <div className="result-box">
          <h2 className="result-title">제작 완료!</h2>
          <div className="result-image">
            <img src={imageUrl} alt="네컷만화" className="result-image-comic" />
            <img
              src={downloadbtn}
              className="save-btn"
              onClick={handleDownloadImage}
            />
          </div>

          <div className="result-image-title">
            <input
              type="text"
              className="answer-input"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              className="page-btn"
              onClick={handleSaveTitle}
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "제목 저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
