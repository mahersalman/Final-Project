import axios from "axios";
import serverUrl from "@config/api";

export const http = axios.create({
  baseURL: `${serverUrl}/api`,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
