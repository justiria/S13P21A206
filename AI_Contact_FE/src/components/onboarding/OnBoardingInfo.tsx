import Lanyard from "../animations/Lanyard/Lanyard";
import ScrollFloat from "../animations/ScrollFloat/ScrollFloat";

export default function OnBoardingInfo() {
  return (
    <div className="onboarding-info">
      <div className="lanyard">
        <Lanyard
          position={[0, 0, 10]}
          gravity={[0, -40, 0]}
          transparent={true}
        />
      </div>
      <div className="onboarding-info-text">
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=0%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          연인 사이, 싸울 때마다 직접 얘기하기 어려우셨죠?
        </ScrollFloat>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=0%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          AI가 당신의 감정을 공감하고, 전달해줄게요.
        </ScrollFloat>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=0%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          우리의 AI가 관계를 이어주는 중재자가 됩니다.
        </ScrollFloat>
      </div>
    </div>
  );
}
