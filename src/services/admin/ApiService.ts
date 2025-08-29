
// import axios from "axios";
// import { API_CONFIG } from "../../config/config";

// const api = axios.create({
//   baseURL: API_CONFIG.BASE_URL,
//   withCredentials: true,
// });

// const addAuthToken = (config: any) => {
//   const token = getLocalStorageItem("adminToken");

//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }

//   logRequestDetails(config);
//   console.groupEnd();
//   return config;
// };

// const logRequestDetails = (config: any) => {
//   console.log(config);

// };


// const getLocalStorageItem = (key: string) => {
//   return localStorage.getItem(key);
// };

// const refreshToken = async (error: any) => {

//   const refreshToken = getCookie("refreshToken");

//   if (!refreshToken) {
//     logoutUser();
//     return Promise.reject(error);
//   }

//   try {
//     const { data } = await axios.post(API_CONFIG.BASE_URL + "/admin/refresh-token", { refreshToken });

//     localStorage.setItem("adminToken", data.token);
//     error.config.headers["Authorization"] = `Bearer ${data.token}`;

//     return api(error.config);
//   } catch (refreshError) {
//     logoutUser();
//     return Promise.reject(refreshError);
//   }
// };

// const getCookie = (name: string) => {
//   return document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))?.split("=")[1];
// };

// const logoutUser = () => {
//   console.group("🚪 Logging Out User");
//   localStorage.clear();
//   document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   console.groupEnd();

//   setTimeout(() => {
//     window.location.href = "/admin/login";
//   }, 1000);
// };

// const handleApiError = async (error: any) => {
//   const status = error.response?.status;
//   if (status === 401) {
//     return refreshToken(error);
//   }

//   console.groupEnd();
//   return Promise.reject(error);
// };

// api.interceptors.request.use(addAuthToken, (error) => {
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


