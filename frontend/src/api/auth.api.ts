import api from "./axios.instance";
import type { ApiResponse, AuthResponse } from "../types";

export async function registerApi(
  name: string,
  email: string,
  password: string,
) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", {
    name,
    email,
    password,
  });
  return res.data;
}

export async function loginApi(email: string, password: string) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    email,
    password,
  });
  return res.data;
}

export async function logoutApi() {
  const res = await api.post<ApiResponse<null>>("/auth/logout");
  return res.data;
}
