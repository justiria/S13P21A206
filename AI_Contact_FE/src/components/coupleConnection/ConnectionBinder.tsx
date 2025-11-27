import doubleArrow from "../../assets/icons/doublearrow.png";
import "../../styles/ConnectionBinder.css";

export default function ConnectionBinder() {
  return (
    <div className="binder">
      <p>
        프로필 설정이 완료되었어요!
        <br />
        커플 연결 후 아이를 만나보세요!
      </p>
      <img src={doubleArrow} />
    </div>
  );
}
