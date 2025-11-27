import closeBtn from "../assets/icons/WhiteLeftArrow.svg";
import "../styles/Modal.css"; // 기존 Modal.css 재사용

interface PhotoBookModalProps {
  onClose: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  // 즐겨찾기 관련 props
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  // 삭제 관련 props
  onDelete: () => Promise<void>; // 또는 () => void
}

export default function PhotoBookModal({
  onClose,
  hasPrev,
  hasNext,
  children,
  onPrev,
  onNext,
  isFavorite,
  onFavoriteToggle,
  onDelete,
}: PhotoBookModalProps) {
  return (
    <>
      {/* 닫기 버튼 */}
      <img src={closeBtn} className="close-btn" onClick={onClose} alt="닫기" />

      {/* 즐겨찾기 버튼 */}
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={onFavoriteToggle}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* 삭제 버튼 */}
      <button className="delete-btn" onClick={onDelete} title="사진 삭제">
        🗑️
      </button>

      {/* 모달 오버레이 */}
      <div className="modal-overlay">
        {hasPrev && (
          <button
            className="arrow-white arrow left"
            onClick={onPrev}
            aria-label="이전 페이지"
          >
            〈
          </button>
        )}
        <div className="content-photo">{children}</div>
        {hasNext && (
          <button
            className="arrow-white arrow right"
            onClick={onNext}
            aria-label="다음 페이지"
          >
            〉
          </button>
        )}
      </div>
    </>
  );
}
