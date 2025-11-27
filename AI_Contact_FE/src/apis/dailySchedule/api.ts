import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { DailyScheduleRequest } from "./request";
import type { DailyScheduleResponse } from "./response";

export const dailySchedulesApi = {
  /* 일정 등록 */
  createSchedule: (payload: DailyScheduleRequest) =>
    apiFetch<ApiResponse<DailyScheduleResponse>>("/schedules", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateSchedule: (scheduleId: number, payload: DailyScheduleRequest) =>
    apiFetch<ApiResponse<DailyScheduleResponse>>(`/schedules/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteSchedule: (scheduleId: number) =>
    apiFetch<ApiResponse<string>>(`/schedules/${scheduleId}`, {
      method: "DELETE",
    }),

  getSchedulesByDate: async (date: string) => {
    const queryParams = new URLSearchParams({
      date: date,
    });
    return apiFetch<ApiResponse<DailyScheduleResponse[]>>(
      `/schedules/day?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
  },

  getSchedulesByMonth: async (year: number, month: number) => {
    const queryParams = new URLSearchParams({
      year: year.toString(),
      month: month.toString(),
    });
    return apiFetch<ApiResponse<DailyScheduleResponse[]>>(
      `/schedules/month?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
  },

  getSchedulesDday: async () => 
    apiFetch<ApiResponse<DailyScheduleResponse[]>>('/schedules/dday', {
        method: "GET",
    }),
};
