import React, { useState } from "react";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "../../styles/AddSchedule.css";

import "swiper/swiper-bundle.css";
import { dailySchedulesApi } from "../../apis/dailySchedule";

interface AddScheduleProps {
  dateInfo: Date;
  onCancel: () => void;
  onDailyScheduleSubmit: () => void;
}

export default function AddSchedule({
  onCancel,
  onDailyScheduleSubmit,
  dateInfo,
}: AddScheduleProps) {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const formatNumber = (num: number) => String(num).padStart(2, "0");
  const hours = Array.from({ length: 24 }, (_, i) =>
    formatNumber((i + 9) % 24)
  );
  const minutes = Array.from({ length: 60 }, (_, i) => formatNumber(i));
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [scheduleHour, setScheduleHour] = useState(0);
  const [scheduleMinute, setScheduleMinute] = useState(0);

  const handleDailySchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleDate = new Date(dateInfo);
    scheduleDate.setUTCHours(scheduleHour);
    scheduleDate.setUTCMinutes(scheduleMinute);
    try {
      await dailySchedulesApi.createSchedule({
        title:title.length==0?"새로운 일정":title,
        memo,
        scheduleDate,
      });
      onDailyScheduleSubmit();
    } catch (error: any) {
      console.error("스케쥴 처리 오류:", error);
      alert(error?.message || "스케쥴 등록 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="calendar-modal add-schedule">
      <div className="modal-header">
        <div className="date">
          <div className="monthday">
            {dateInfo.getFullYear()}년 {dateInfo.getMonth() + 1}월{" "}
            {dateInfo.getDate()}일
          </div>
          <div className="day">{days[dateInfo.getDay()]}</div>
        </div>
      </div>
      <form className="calendar-modal-body" onSubmit={handleDailySchedule}>
        <input
          className="schedule-title"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <div className="modal-content">
          <div className="section timer">
            <p className="title">시간</p>
            <div className="timer-layout">
              <Swiper
                onSlideChange={(swiper) => {
                  setScheduleHour((swiper.realIndex + 9) % 24);
                }}
                centeredSlides={true}
                slidesPerView={3}
                mousewheel={true}
                loop={true}
                modules={[Mousewheel]}
                direction={"vertical"}
                className="mySwiper"
              >
                {hours.map((hour) => (
                  <SwiperSlide key={`hour-${hour}`}>{hour}</SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSlideChange={(swiper) => {
                  setScheduleMinute(swiper.realIndex);
                }}
                centeredSlides={true}
                slidesPerView={3}
                loop={true}
                mousewheel={true}
                modules={[Mousewheel]}
                direction={"vertical"}
                className="mySwiper"
              >
                {minutes.map((minute) => (
                  <SwiperSlide key={`minute-${minute}`}>{minute}</SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div />
          </div>
          <div className="section memo">
            <p className="title">메모</p>
            <textarea
              className="memo"
              placeholder="메모를 입력하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onCancel}>
            x 취소
          </button>
          <button className="submit-btn">+ 등록</button>
        </div>
      </form>
    </div>
  );
}
