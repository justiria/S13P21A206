import { useState } from "react";

interface SignUpFormProps {
  onToggle: () => void;
  onSignUpSubmit?: (email: string, password: string) => void;
}

export default function SignUpForm({
  onToggle,
  onSignUpSubmit,
}: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (onSignUpSubmit) {
      onSignUpSubmit(email, password);
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">회원가입</button>
      <p className="toggle-text">
        이미 계정이 있으신가요? <span onClick={onToggle}>로그인</span>
      </p>
    </form>
  );
}
