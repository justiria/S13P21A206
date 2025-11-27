import React from "react";
import type { NicknameItem } from "../apis/nickname/response";

// 페이지/카드 모두에서 쓰는 공용 로컬 타입
type LocalNickname = NicknameItem & { updated_at: string };

type PageProps = {
  item: LocalNickname;
  onEdit: (item: LocalNickname) => void;
  onDelete: (id: number) => void;
};

// react-pageflip 자식은 ref 전달이 가능해야 하므로 forwardRef 사용
const DictionaryPageCard = React.forwardRef<HTMLDivElement, PageProps>(
  ({ item, onEdit, onDelete }, ref) => {
    return (
      <div ref={ref} className="flip-page">
        <div className="dictionary-page">
          <div className="dictionary-page-header">
            <div className="page-title">{item.word}</div>
            <div className="btn-group">
              <div className="wordedit-btn" onClick={() => onEdit(item)}>
                편집
              </div>
              <div className="worddelete-btn" onClick={() => onDelete(item.id)}>
                삭제
              </div>
            </div>
          </div>
          <div className="description">{item.description}</div>
          <div className="time-info">
            <div>생성 시각: {item.created_at}</div>
            <div>수정 시각: {item.updated_at}</div>
          </div>
        </div>
      </div>
    );
  }
);

DictionaryPageCard.displayName = "DictionaryPageCard";
export default DictionaryPageCard;
