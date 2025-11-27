import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "../styles/CalendarPage.css";
import "../styles/MainPages.css";

import AddSchedule from "../components/calendar/AddSchedule";
import CalendarDetail from "../components/calendar/CalendarDetail";
import Modal from "../components/modal/Modal";
import Sidebar from "../components/Sidebar";

import {
  type DatesSetArg,
  type DayCellContentArg,
  type EventClickArg,
  type EventInput,
} from "@fullcalendar/core/index.js";
import koLocale from "@fullcalendar/core/locales/ko";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { dailySchedulesApi } from "../apis/dailySchedule";
import type { DailyScheduleResponse } from "../apis/dailySchedule/response";
import EditSchedule from "../components/calendar/EditSchedule";
import rrulePlugin from "@fullcalendar/rrule";
import { UsersApi } from "../apis/user";
import { CouplesApi } from "../apis/couple";
import { aiChildApi } from "../apis/aiChild";

export default function CalendarPage() {
  type ModalType = "detail" | "add" | "edit" | "off";

  // 클릭된 날짜를 최소 정보만 갖는 타입으로 관리 (이벤트/셀 클릭 모두 호환)
  type ClickedDate = { date: Date; dateStr: string };

  const initialScheduleData: DailyScheduleResponse = {
    id: 0,
    title: "",
    memo: "",
    scheduleDate: "",
    createdAt: "",
    updatedAt: "",
  };

  const [modalStatus, setModalStatus] = useState<ModalType>("off");
  const [clickedDateInfo, setClickedDateInfo] = useState<ClickedDate | null>(
    null
  ); // 🔄 타입 변경
  const [editScheduleData, setEditScheduleData] =
    useState<DailyScheduleResponse>(initialScheduleData);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [recurringEvents, setRecurringEvents] = useState<EventInput[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchAllInfoAndCreateEvents = async () => {
      try {
        const [myInfoRes, partnerInfoRes, coupleInfoRes] = await Promise.all([
          UsersApi.getMe(),
          CouplesApi.getPartnerInfo(),
          CouplesApi.getCoupleInfo(),
          aiChildApi.getMyChildren(),
        ]);

        const myInfo = myInfoRes.data;
        const partnerInfo = partnerInfoRes.data;
        const coupleInfo = coupleInfoRes.data;

        const events = [];
        events.push({
          title: `🎂 ${myInfo.name}의 생일`,
          rrule: {
            dtstart: myInfo.birthDate,
            freq: "yearly",
            until: "2099-12-31",
          },
        });
        events.push({
          title: `🎂 ${partnerInfo.name}의 생일`,
          rrule: {
            dtstart: partnerInfo.birthDate,
            freq: "yearly",
            until: "2099-12-31",
          },
        });
        events.push({
          title: `❤️ 우리 기념일`,
          rrule: {
            dtstart: coupleInfo.startDate,
            freq: "yearly",
            until: "2099-12-31",
          },
        });

        setRecurringEvents(events);
      } catch (error) {
        console.error("정보를 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    fetchAllInfoAndCreateEvents();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dailySchedulesApi.getSchedulesByMonth(
          year,
          month
        );
        const eventsData = response.data;
        const processedData = eventsData.map((element) => ({
          title: element.title,
          start: element.scheduleDate,
        }));
        setEvents([...processedData, ...recurringEvents]);
      } catch (e) {
        /* empty */
      }
    };

    fetchData();
  }, [refetchTrigger, year, month, recurringEvents]); // 연/월 바뀌면 재요청

  // 날짜 셀 클릭 → detail
  function openCalendarDetail(arg: DateClickArg) {
    const date = arg.date;
    setClickedDateInfo({ date, dateStr: date.toISOString() });
    setModalStatus("detail");
  }

  // 이벤트 클릭 → detail
  function openEventDetail(arg: EventClickArg) {
    const date = arg.event.start ?? new Date(arg.event.startStr);
    date.setHours(date.getHours()-9); // KST -> UTC로 변경
    setClickedDateInfo({ date, dateStr: date.toISOString() });
    setModalStatus("detail");
  }

  const handleDayCellContent = (e: DayCellContentArg) => {
    const dayNumber = e.dayNumberText.replace("일", "");
    return dayNumber;
  }

  const handleNextDay = () => {
    if (!clickedDateInfo) return;
    const currentDate = new Date(clickedDateInfo.date);
    currentDate.setDate(currentDate.getDate() + 1);
    setClickedDateInfo({
      date: currentDate,
      dateStr: currentDate.toISOString(),
    });
  };

  const handlePrevDay = () => {
    if (!clickedDateInfo) return;
    const currentDate = new Date(clickedDateInfo.date);
    currentDate.setDate(currentDate.getDate() - 1);
    setClickedDateInfo({
      date: currentDate,
      dateStr: currentDate.toISOString(),
    });
  };

  function handleDailyScheduleSumbit() {
    alert("일정이 등록되었습니다.");
    setModalStatus("off");
    setRefetchTrigger((prev) => prev + 1);
  }

  function handleDailyScheduleDelete() {
    alert("일정이 삭제되었습니다.");
    setModalStatus("off");
    setRefetchTrigger((prev) => prev + 1);
  }

  function handleScheduleEdit(scheduleData: DailyScheduleResponse) {
    setEditScheduleData(scheduleData);
    setModalStatus("edit");
  }

  const updateDate = (dateInfo: DatesSetArg) => {
    setYear(dateInfo.view.currentStart.getFullYear());
    setMonth(dateInfo.view.currentStart.getMonth() + 1);
    setRefetchTrigger((prev) => prev + 1);
  };

  const now = () => {
    const res = new Date();
    res.setHours(res.getHours() + 9);
    return res;
  };

  function setModalContent(modalStatus: ModalType) {
    switch (modalStatus) {
      case "off":
        return null;
      case "detail":
        return (
          <Modal
            onClose={() => setModalStatus("off")}
            hasNext={false}
            hasPrev={false}
          >
            <div className="dictionary-container">
              <button
                className="arrow left arrow-white"
                onClick={handlePrevDay}
                aria-label="이전 날짜"
              >
                〈
              </button>

              {clickedDateInfo && (
                <CalendarDetail
                  dateInfo={clickedDateInfo.date}
                  onAdd={() => setModalStatus("add")}
                  onDelete={handleDailyScheduleDelete}
                  onEdit={handleScheduleEdit}
                />
              )}

              <button
                className="arrow right arrow-white"
                onClick={handleNextDay}
                aria-label="다음 날짜"
              >
                〉
              </button>
            </div>
          </Modal>
        );
      case "add":
        return (
          <Modal
            onClose={() => setModalStatus("off")}
            hasNext={false}
            hasPrev={false}
          >
            {clickedDateInfo && (
              <AddSchedule
                dateInfo={clickedDateInfo.date}
                onCancel={() => setModalStatus("detail")}
                onDailyScheduleSubmit={handleDailyScheduleSumbit}
              />
            )}
          </Modal>
        );
      case "edit":
        return (
          <Modal
            onClose={() => setModalStatus("off")}
            hasNext={false}
            hasPrev={false}
          >
            {clickedDateInfo && (
              <EditSchedule
                scheduleInfo={editScheduleData}
                dateInfo={clickedDateInfo.date}
                onCancel={() => setModalStatus("detail")}
                onDailyScheduleSubmit={handleDailyScheduleSumbit}
              />
            )}
          </Modal>
        );
    }
  }

  return (
    <div className="main-layout">
      {modalStatus !== "off" &&
        createPortal(setModalContent(modalStatus), document.body)}
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h4># 일정 # 공유 </h4>
          <h3>캘린더 📆</h3>
        </div>

        <div className="calendar-container">
          <div className="calendar-container-top-mid">
            <div className="calendar-container-top"></div>
            <div className="calendar-container-mid">
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  rrulePlugin,
                ]}
                initialView="dayGridMonth"
                editable={false}
                events={events}
                aspectRatio={1.6}
                locale={koLocale}
                headerToolbar={{
                  left: "prev,title,next",
                  center: "",
                  right: "today",
                }}
                dayCellContent={handleDayCellContent}
                displayEventTime={false}
                dayMaxEventRows={true}
                dayMaxEvents={2}
                timeZone={"UTC"}
                defaultTimedEventDuration={"00:01"}
                datesSet={updateDate}
                dateClick={openCalendarDetail}
                eventClick={openEventDetail}
                now={now}
              />
            </div>
          </div>
          <div className="calendar-container-bottom"></div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
