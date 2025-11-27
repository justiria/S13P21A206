import logo from "../assets/images/symbol.svg";
import "../styles/Logo.css";

interface LogoProps {
  variant?: "default" | "fixed"; // 'default'는 일반, 'fixed'는 고정 위치
}

export default function Logo({ variant = "default" }: LogoProps) {
  return (
    <h2 className={`logo-frame ${variant === "fixed" ? "logo-fixed" : ""}`}>
      <img src={logo} alt="로고" className="logo-image" />
      AI Contact
    </h2>
  );
}
