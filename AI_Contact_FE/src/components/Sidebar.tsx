import { useNavigate } from "react-router-dom";
import NavAi from "../assets/icons/NavAi.svg?react";
import NavCalendar from "../assets/icons/NavCalendar.svg?react";
import NavDictionary from "../assets/icons/NavDictionary.svg?react";
import NavGallery from "../assets/icons/NavGallery.svg?react";
import NavLogout from "../assets/icons/NavLogout.svg?react";
import NavMypage from "../assets/icons/NavMypage.svg?react";
import "../styles/Sidebar.css";
import Logo from "./Logo.tsx";

// 컴포넌트 만들기
export default function Sidebar() {
  const navigate = useNavigate();
  return (
    // 전체 사이드바를 감싸는 컨테이너
    <aside className="sidebar">
      {/* 상단 영역: 로고 + 제목 + 메뉴 리스트 */}
      <div>
        {/* 제목 줄: 로고 이미지 + 텍스트 "아이:건택" */}
        <Logo />

        <nav>
          <div
            className={
              location.pathname === "/ai" ||
              location.pathname.startsWith("/talk") || // 이야기하기
              location.pathname.startsWith("/cartoon") // 네컷만화
                ? "sidebar-nav-btn active"
                : "sidebar-nav-btn"
            }
            onClick={() => navigate("/ai")}
          >
            <NavAi className="nav-icon" />
            <div>아이</div>
          </div>

          <div
            className={
              location.pathname === "/gallery"
                ? "sidebar-nav-btn active"
                : "sidebar-nav-btn"
            }
            onClick={() => navigate("/gallery")}
          >
            <NavGallery className="nav-icon" />
            <div>갤러리</div>
          </div>

          <div
            className={
              location.pathname === "/calendar"
                ? "sidebar-nav-btn active"
                : "sidebar-nav-btn"
            }
            onClick={() => navigate("/calendar")}
          >
            <NavCalendar className="nav-icon" />
            <div>캘린더</div>
          </div>

          <div
            className={
              location.pathname === "/dictionary"
                ? "sidebar-nav-btn active"
                : "sidebar-nav-btn"
            }
            onClick={() => navigate("/dictionary")}
          >
            <NavDictionary className="nav-icon" />
            <div>애칭 백과사전</div>
          </div>

          <div
            className={
              location.pathname === "/mypage"
                ? "sidebar-nav-btn active"
                : "sidebar-nav-btn"
            }
            onClick={() => navigate("/mypage")}
          >
            <NavMypage className="nav-icon" />
            <div>마이페이지</div>
          </div>
        </nav>
      </div>

      {/* 하단 영역: 닫기 버튼과 로그아웃 버튼 */}
      <div className="sidebar-bottom">
        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            navigate("/auth");
          }}
          className="logout-btn"
        >
          <NavLogout className="nav-icon-logout" />
          <div>로그아웃</div>
        </button>
      </div>
    </aside>
  );
}
