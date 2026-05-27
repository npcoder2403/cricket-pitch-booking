import api from "./axios.instance";
import type { ApiResponse, Slot } from "../types";

export async function fetchSlots(pitchId: string, date: string) {
  const res = await api.get<ApiResponse<Slot[]>>("/slots", {
    params: { pitchId, date },
  });
  return res.data;
}
