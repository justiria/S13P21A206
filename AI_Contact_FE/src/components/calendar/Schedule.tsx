import { useState } from "react";
import { dailySchedulesApi } from "../../apis/dailySchedule";

interface ScheduleProps {
  id: number;
  time: string;
  title: string;
  content: string;
  onDelete: () => void;
  onEditRequest: (id: number) => void;
}

export default function Schedule({
  id,
  time,
  title,
  content,
  onDelete,
  onEditRequest,
}: ScheduleProps) {
  const [isCollapse, setIsCollapse] = useState(false);

  const date = new Date(time);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;

  const handleDelete = async () => {
    if (window.confirm("삭제 하시겠습니까?")) {
      try {
        const response = await dailySchedulesApi.deleteSchedule(id);
        console.log("삭제 완료", response);
        onDelete();
      } catch (e) {
        console.log("일정 삭제 중 에러 발생", e);
        alert("일정 삭제 중 오류가 발생했습니다");
      }
    }
  };

  const handleEdit = () => {
    onEditRequest(id);
  };

  return (
    <div className="schedule-container">
      <div
        className="schedule-header"
        onClick={() => setIsCollapse(!isCollapse)}
      >
        <div className="schedule-time">{formattedTime}</div>
        <div className="schedule-title">{title}</div>
      </div>
      {isCollapse && (
        <div className="schedule-content">
          <div className="schedule-memo">
            {content || "등록된 메모가 없습니다."}
          </div>
          <div className="schedule-buttons">
            <div onClick={handleEdit}>수정</div>
            <div onClick={handleDelete}>삭제</div>
          </div>
        </div>
      )}
    </div>
  );
}
