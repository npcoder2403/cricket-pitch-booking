import api from "./axios.instance";
import type { ApiResponse, Booking } from "../types";

export async function reserveSlotApi(
  pitchId: string,
  date: string,
  startTime: string,
) {
  const res = await api.post<ApiResponse<{ reservedUntil: string }>>(
    "/reserve-slot",
    { pitchId, date, startTime },
  );
  return res.data;
}

export async function confirmBookingApi(
  pitchId: string,
  date: string,
  startTime: string,
) {
  const res = await api.post<ApiResponse<Booking>>("/confirm-booking", {
    pitchId,
    date,
    startTime,
  });
  return res.data;
}

export async function cancelReservationApi(
  pitchId: string,
  date: string,
  startTime: string,
) {
  const res = await api.post<ApiResponse<null>>("/cancel-reservation", {
    pitchId,
    date,
    startTime,
  });
  return res.data;
}

export async function fetchMyBookings() {
  const res = await api.get<ApiResponse<Booking[]>>("/my-bookings");
  return res.data;
}
