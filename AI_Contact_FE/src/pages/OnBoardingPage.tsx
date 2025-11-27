import { useNavigate } from "react-router-dom";
import WhiteLoginBtn from "../assets/icons/LoginBtnWhite.svg";
import StartBtn from "../assets/icons/StartBtn.svg";
import TItleMockUp from "../assets/images/TItleMockUp.png";
import CurvedLoop from "../components/animations/CurvedLoop/CurvedLoop";
import SplitText from "../components/animations/SplitText/SplitText";
import Logo from "../components/Logo";
import FixedButtons from "../components/onboarding/FixedButtons";
import OnBoardingFooter from "../components/onboarding/OnBoardingFooter";
import OnBoardingGallery from "../components/onboarding/OnBoardingGallery";
import OnBoardingInfo from "../components/onboarding/OnBoardingInfo";
import "../styles/OnBoardingPage.css";


export default function OnBoardingPage() {
  const navigate = useNavigate();
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <>
      <Logo variant="fixed" />
      <div className="onboaring-layout">
        <div className="onboarding-title">
          {/* <h2>우리 사이, 아이(AI)가 이어줘요</h2> */}
          <SplitText
            text="우리 사이, 아이(AI)가 이어줘요"
            className="text-2xl font-semibold text-center"
            delay={40}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <div className="onboarding-content">
            우리의 사소한 하루들이,
            <br />
            아이 덕분에 특별해지는 경험을 제공해드립니다.
          </div>
          <div className="auth-btn">
            <img
              src={StartBtn}
              alt="시작하기"
              onClick={() => navigate("/auth")}
            />
            <img
              src={WhiteLoginBtn}
              alt="로그인"
              onClick={() => navigate("/auth")}
            />
          </div>
          <img src={TItleMockUp} alt="타이틀" className="onboarding-image" />
        </div>
        <CurvedLoop
          marqueeText="   AI   ✦   CONTACT   ✦"
          speed={1.5}
          curveAmount={0}
          direction="left"
          interactive={false}
          className="text-decoration"
        />
        <FixedButtons />
        <OnBoardingInfo />
        <OnBoardingGallery />
        <OnBoardingFooter />
      </div>
    </>
  );
}
