import { api, setAccessToken } from "./api";
import {
  LoginUserFormInterface,
  RegisterUserFormInterface,
  UserCardInterface,
} from "../data";

export const register = async (data: RegisterUserFormInterface) => {
  const response = await api.post<{
    accessToken: string;
    user: UserCardInterface;
  }>("/auth/register", data);
  const { accessToken, user } = response.data;
  setAccessToken(accessToken);
  return user;
};

export const login = async (credentials: LoginUserFormInterface) => {
  const response = await api.post("/auth/login", credentials);

  const { accessToken, user } = response.data;

  setAccessToken(accessToken);

  return user;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }
};

export const fetchProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
