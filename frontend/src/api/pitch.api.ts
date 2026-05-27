import api from "./axios.instance";
import type { ApiResponse, Pitch } from "../types";

export async function fetchPitches() {
  const res = await api.get<ApiResponse<Pitch[]>>("/pitches");
  return res.data;
}

export async function fetchPitchById(id: string) {
  const res = await api.get<ApiResponse<Pitch>>(`/pitches/${id}`);
  return res.data;
}
