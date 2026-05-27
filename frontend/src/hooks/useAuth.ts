import { useAuthStore } from "../store/auth.store";
import { loginApi, registerApi, logoutApi } from "../api/auth.api";
import { useState } from "react";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      login(res.data.user, res.data.token);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerApi(name, email, password);
      login(res.data.user, res.data.token);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // logout anyway
    }
    logout();
  };

  return { user, isAuthenticated, loading, error, handleLogin, handleRegister, handleLogout };
}
