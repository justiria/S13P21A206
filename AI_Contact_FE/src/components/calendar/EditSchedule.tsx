import React, { useEffect, useState } from "react";
import { Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "../../styles/AddSchedule.css";

import "swiper/swiper-bundle.css";
import { dailySchedulesApi } from "../../apis/dailySchedule";
import type { DailyScheduleResponse } from "../../apis/dailySchedule/response";

interface AddScheduleProps {
  scheduleInfo: DailyScheduleResponse;
  dateInfo: Date;
  onCancel: () => void;
  onDailyScheduleSubmit: () => void;
}

export default function EditSchedule({
  scheduleInfo,
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
  const defaultDate = new Date(scheduleInfo.scheduleDate);
  const hours = Array.from({ length: 24 }, (_, i) =>
    formatNumber((i + defaultDate.getHours()) % 24)
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    formatNumber((i + defaultDate.getMinutes()) % 60)
  );
  const [currentTitle, setCurrentTitle] = useState(scheduleInfo.title);
  const [currentMemo, setCurrentMemo] = useState(scheduleInfo.memo);
  const [scheduleHour, setScheduleHour] = useState(0);
  const [scheduleMinute, setScheduleMinute] = useState(0);
  const [year, setYear] = useState<number | string>(dateInfo.getFullYear());
  const [month, setMonth] = useState<number | string>(dateInfo.getMonth() + 1);
  const [date, setDate] = useState<number | string>(dateInfo.getDate());
  const [day, setDay] = useState(days[dateInfo.getDay()]);

  const handleDailySchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    const scheduleDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(date) + 1
    );
    scheduleDate.setUTCHours(scheduleHour);
    scheduleDate.setUTCMinutes(scheduleMinute);
    try {
      await dailySchedulesApi.updateSchedule(scheduleInfo.id, {
        title: currentTitle.length==0?"새로운 일정":currentTitle,
        memo: currentMemo,
        scheduleDate,
      });
      onDailyScheduleSubmit();
    } catch (error: any) {
      console.error("스케쥴 처리 오류:", error);
      alert(error?.message || "스케쥴 등록 중 문제가 발생했습니다.");
    }
  };

  const limitNumberLength = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > e.currentTarget.maxLength) {
      e.currentTarget.value = e.currentTarget.value.slice(
        0,
        e.currentTarget.maxLength
      );
    }
  };

  useEffect(() => {
    setDay(
      days[new Date(Number(year), Number(month) - 1, Number(date)).getDay()]
    );
  }, [year, month, date]);

  const updateValue = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const res = Math.min(
      Number(e.target.max),
      Math.max(Number(e.target.min), Number(e.target.value))
    );
    return res;
  };

  return (
    <div className="calendar-modal add-schedule">
      <div className="modal-header">
        <div className="date">
          <div className="monthday">
            <input
              className="year"
              type="number"
              value={year}
              min={1900}
              max={2099}
              maxLength={4}
              onInput={(e) => limitNumberLength(e)}
              onChange={(e) => setYear(e.target.valueAsNumber)}
              onBlur={(e) => setYear(updateValue(e))}
            />
            년
            <input
              type="number"
              value={month}
              min={1}
              max={12}
              maxLength={2}
              onInput={(e) => limitNumberLength(e)}
              onChange={(e) => setMonth(e.target.valueAsNumber)}
              onBlur={(e) => setMonth(updateValue(e))}
            />
            월
            <input
              type="number"
              value={date}
              min={1}
              max={new Date(Number(year), Number(month), 0).getDate()}
              maxLength={2}
              onInput={(e) => limitNumberLength(e)}
              onChange={(e) => setDate(e.target.valueAsNumber)}
              onBlur={(e) => setDate(updateValue(e))}
            />
            일
          </div>
          <div className="day">{day}</div>
        </div>
      </div>
      <form className="calendar-modal-body" onSubmit={handleDailySchedule}>
        <input
          className="schedule-title"
          placeholder="제목"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
        ></input>
        <div className="modal-content">
          <div className="section timer">
            <p className="title">시간</p>
            <div className="timer-layout">
              <Swiper
                onSlideChange={(swiper) => {
                  setScheduleHour(
                    (swiper.realIndex + defaultDate.getHours()) % 24
                  );
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
                  setScheduleMinute(
                    (swiper.realIndex + defaultDate.getMinutes()) % 60
                  );
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
              value={currentMemo}
              onChange={(e) => setCurrentMemo(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onCancel}>
            x 취소
          </button>
          <button className="submit-btn">+ 수정</button>
        </div>
      </form>
    </div>
  );
}
