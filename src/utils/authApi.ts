// utils/authApi.ts
import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config/config";

interface RoleConfig {
  tokenKey: string;
  refreshUrl: string;
  redirectUrl: string;
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  user: {
    tokenKey: "accessToken",
    refreshUrl: "/users/refresh-token",
    redirectUrl: "/user/login",
  },
  creator: {
    tokenKey: "accessToken",
    refreshUrl: "/creator/refresh-token",
    redirectUrl: "/creator/login",
  },
  admin: {
    tokenKey: "accessToken",
    refreshUrl: "/admin/refresh-token",
    redirectUrl: "/admin/login",
  },
};

export const createApiInstance = (role: "user" | "creator" | "admin"): AxiosInstance => {
  const { tokenKey, refreshUrl, redirectUrl } = ROLE_CONFIGS[role];

  const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    withCredentials: true,
  });

  const getLocalStorageItem = (key: string) => localStorage.getItem(key);

  const getCookie = (name: string) =>
    document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))?.split("=")[1];

  const logoutUser = () => {
    console.group("🚪 Logging Out");
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(role);
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("✅ Cleared localStorage and cookie");
    console.groupEnd();

    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  };

  const refreshToken = async (error: any) => {
    
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      logoutUser();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(API_CONFIG.BASE_URL + refreshUrl, { refreshToken });
      localStorage.setItem(tokenKey, data.token);
      error.config.headers["Authorization"] = `Bearer ${data.token}`;
      return api(error.config);
    } catch (refreshError) {
      logoutUser();
      return Promise.reject(refreshError);
    }
  };

  const addAuthToken = (config: any) => {
    const token = getLocalStorageItem(tokenKey);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  };

  const handleApiError = async (error: any) => {
    const status = error.response?.status;

    if (status === 403) {
      logoutUser();
      return Promise.reject(error);
    }

    if (status === 401) {
      return refreshToken(error);
    }

    return Promise.reject(error);
  };

  // Attach interceptors
  api.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
  api.interceptors.response.use((res) => res, handleApiError);

  return api;
};
