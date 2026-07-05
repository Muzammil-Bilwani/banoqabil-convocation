import { BASE_URL } from "./config";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
  mobileNumber: string;
  assignedCampus: string[];
  assignedRegion: string[];
  assignedDistrict: string[];
  scope: {
    campusIds: string[] | null;
    areaIds: string[] | null;
  };
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ??
        "Login failed. Please try again.",
    );
  }

  return data as LoginResponse;
}

export function saveSession(data: LoginResponse) {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw || !localStorage.getItem("accessToken")) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
