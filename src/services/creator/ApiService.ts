
// import axios from "axios";
// import { API_CONFIG } from "../../config/config";

// const api = axios.create({
//   baseURL: API_CONFIG.BASE_URL, 
//   withCredentials: true,
// });

// const addAuthToken = (config: any) => {
//   const token = getLocalStorageItem("creatorToken");

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//     console.log("✅ Token added to headers");
//   } else {
//     console.warn("❌ No token found in localStorage");
//   }

//   logRequestDetails(config);
//   console.groupEnd();
//   return config;
// };

// const logRequestDetails = (config: any) => {
//   console.log("🌍 Request URL:", config.url);
//   console.log("🔧 Request Method:", config.method);
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
//     const { data } = await axios.post(API_CONFIG.BASE_URL + "/creator/refresh-token", { refreshToken });
//     console.log("🔄 New Token Received:", data.token);

//     localStorage.setItem("creatorToken", data.token);
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
//   localStorage.removeItem("creatorToken");
//   localStorage.removeItem("creator");
//   document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   console.log("✅ LocalStorage cleared & refresh token deleted");
//   console.groupEnd();

//   setTimeout(() => {
//     window.location.href = "/creator/login";
//   }, 60000); 
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
//     console.group("🌐 API Response Interceptor");
//     console.log("✅ Response Status:", response.status);
//     console.log("📦 Response Data:", response.data);
//     console.groupEnd();
//     return response;
//   },
//   handleApiError
// );

// export default api;



