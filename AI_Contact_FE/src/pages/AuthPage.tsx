import { useState } from "react";
import AuthBackground from "../components/auth/AuthBackground.tsx";
import AuthForm from "../components/auth/AuthForm.tsx";
import ProfileForm from "../components/auth/ProfileForm.tsx";
import "../styles/MainPages.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState<"emailPassword" | "profile">(
    "emailPassword"
  );
  const [signUpData, setSignUpData] = useState({ email: "", password: "" });

  const handleSignUpSubmit = (email: string, password: string) => {
    setSignUpData({ email, password });
    setSignUpStep("profile");
  };

  const handleProfileSubmit = () => {
    alert("회원가입이 완료되었습니다.");
    setIsSignUp(false);
    setSignUpStep("emailPassword");
  };

  return (
    <div className="main-layout">
      <AuthBackground isSignUp={isSignUp} />
      <AuthForm
        position="left"
        onFormChange={() => {
          setIsSignUp((prev) => !prev);
          setSignUpStep("emailPassword");
        }}
        isSignUp={false}
        isVisible={!isSignUp}
      />
      {signUpStep === "emailPassword" && (
        <AuthForm
          position="right"
          onFormChange={() => {
            setIsSignUp((prev) => !prev);
            setSignUpStep("emailPassword");
          }}
          isSignUp={true}
          isVisible={isSignUp}
          onSignUpSubmit={handleSignUpSubmit}
        />
      )}
      {signUpStep === "profile" && isSignUp && (
        <ProfileForm
          email={signUpData.email}
          password={signUpData.password}
          onProfileSubmit={handleProfileSubmit}
          isVisible={isSignUp}
          onBack={() => setSignUpStep("emailPassword")}
        />
      )}
    </div>
  );
}
