// import axios from "axios";
// import { API_CONFIG } from "../config/config"; 

// const api = axios.create({
//   baseURL: API_CONFIG.BASE_URL, 
//   withCredentials: true,
// });

// const addAuthToken = (config: any) => {
//   const token = getLocalStorageItem("userToken");

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   } 

//   logRequestDetails(config);
//   console.groupEnd();
//   return config;
// };

// const logRequestDetails = (config: any) => {
// console.log(config);

// };

// const getLocalStorageItem = (key: string) => {
//   return localStorage.getItem(key);
// };

// const refreshToken = async (error: any) => {
//   console.warn("🔄 Token expired, attempting refresh...");

//   const refreshToken = getCookie("refreshToken");

//   if (!refreshToken) {
//     console.error("❌ No refresh token found, logging out...");
//     logoutUser();
//     return Promise.reject(error);
//   }

//   try {
//     const { data } = await axios.post(API_CONFIG.BASE_URL + "/users/refresh-token", { refreshToken });

//     localStorage.setItem("token", data.token);
//     error.config.headers["Authorization"] = `Bearer ${data.token}`;

//     return api(error.config); 
//   } catch (refreshError) {
//     console.error("❌ Refresh token failed:", refreshError);
//     logoutUser();
//     return Promise.reject(refreshError);
//   }
// };

// const getCookie = (name: string) => {
//   return document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))?.split("=")[1];
// };

// const logoutUser = () => {
//   console.group("🚪 Logging Out User");
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   console.log("✅ LocalStorage cleared & refresh token deleted");
//   console.groupEnd();

//   setTimeout(() => {
//     window.location.href = "/user/login"; 
//   }, 1000); 
// };

// const handleApiError = async (error: any) => {
//   console.group("❌ API Error Interceptor");
//   const status = error.response?.status;
//   console.log("🚨 Error Status:", status);
//   console.log("📝 Error Details:", error.response?.data);

//   if (status === 403) {
//     console.warn("🚫 User is blocked! Logging out...");
//     logoutUser();
//     return Promise.reject(error);
//   }

//   if (status === 401) {
//     return refreshToken(error);
//   }

//   console.groupEnd();
//   return Promise.reject(error);
// };

// api.interceptors.request.use(addAuthToken, (error) => {
//   console.error("❌ Request Interceptor Error:", error);
//   return Promise.reject(error);
// });

// api.interceptors.response.use(
//   (response) => {
 
//     console.groupEnd();
//     return response;
//   },
//   handleApiError
// );

// export default api;






