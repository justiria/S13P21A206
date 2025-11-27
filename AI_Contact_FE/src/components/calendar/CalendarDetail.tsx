import { useEffect, useState } from "react";
import { dailySchedulesApi } from "../../apis/dailySchedule/api";
import type { DailyScheduleResponse } from "../../apis/dailySchedule/response";
import "../../styles/CalendarDetail.css";
import Schedule from "./Schedule";

interface CalendarDetailProps {
  dateInfo: Date;
  onAdd: () => void;
  onDelete: () => void;
  onEdit: (schedule: DailyScheduleResponse) => void;
}

export default function CalendarDetail({
  dateInfo,
  onAdd,
  onDelete,
  onEdit,
}: CalendarDetailProps) {
  const [calendarEvents, setCalendarEvents] = useState<DailyScheduleResponse[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = String(dateInfo.toISOString());
        const response = await dailySchedulesApi.getSchedulesByDate(date);
        const eventsData = response.data;
        setCalendarEvents(eventsData);
      } catch (e) {
        console.log(e);
        alert("일정 조회 중 오류가 발생했습니다");
      }
    };

    fetchData();
  }, [dateInfo]);

  const handleEditRequest = (scheduleId: number) => {
    // schedules 목록에서 id가 일치하는 스케줄을 찾는다.
    const scheduleToEdit = calendarEvents.find((s) => s.id === scheduleId);

    // 데이터를 찾았다면, 부모에게 받은 onEditClick 함수를 호출해 전체 데이터를 넘겨준다.
    if (scheduleToEdit) {
      onEdit(scheduleToEdit);
    }
  };

  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  return (
    <div className="calendar-modal">
      <div className="modal-header">
        <div className="date">
          <div className="monthday">
            {dateInfo.getFullYear()}년 {dateInfo.getMonth() + 1}월{" "}
            {dateInfo.getDate()}일
          </div>
          <div className="day">{days[dateInfo.getDay()]}</div>
        </div>
        <div className="add-btn-wrapper">
          <button className="add-btn" onClick={onAdd}>
            + 일정 등록
          </button>
        </div>
      </div>
      <div className="modal-body">
        {calendarEvents.length > 0 ? (
          calendarEvents.map((obj) => {
            return (
              <Schedule
                key={`${obj.scheduleDate}+${obj.createdAt}`}
                id={obj.id}
                time={obj.scheduleDate}
                title={obj.title}
                content={obj.memo}
                onDelete={onDelete}
                onEditRequest={handleEditRequest}
              />
            );
          })
        ) : (
          <div
            style={{
              color: "var(--text-light)",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            등록된 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
