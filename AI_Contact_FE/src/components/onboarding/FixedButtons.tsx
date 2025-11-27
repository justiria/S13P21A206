import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WhiteLoginBtn from "../../assets/icons/LoginBtnWhite.svg";
import TopBtn from "../../assets/icons/TopBtn.svg";
import "../../styles/FixedButtons.css";

export default function FixedButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) setIsVisible(true);
    else setIsVisible(false);
  };

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 부드럽게 스크롤
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

  return (
    <div className="fixed-button">
      {isVisible && (
        <>
          <img src={TopBtn} className="top-button" onClick={scrollToTop} />
          <div className="fixed-navbar">
            <img
              src={WhiteLoginBtn}
              alt="로그인"
              onClick={() => navigate("/auth")}
            />
            {/* <img
              src={LoginBtnGradient}
              className="login"
              onClick={() => navigate("/auth")}
            />
            <img
              src={SignUpBtn}
              className="signup"
              onClick={() => navigate("/auth")}
            /> */}
          </div>
        </>
      )}
    </div>
  );
}
