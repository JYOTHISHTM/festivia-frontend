// import api from "./ApiService";


import { createApiInstance } from "../../utils/authApi";
const api = createApiInstance("admin");
import { AxiosError } from "axios";

import { API_CONFIG } from "../../config/config";

const { ADMIN_ENDPOINTS } = API_CONFIG;




export const getDashboardData = async () => {
  try {
    const response = await api.get(ADMIN_ENDPOINTS.DASHBOARD);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error fetching dashboard data:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard data");
  }
};

export const getSubscriptionHistory = async () => {
  try {
    const response = await api.get(ADMIN_ENDPOINTS.SUBSCRIPTION_HISTORY);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error fetching subscription history:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch subscription history");
  }
};


export const getPendingCreators = async () => {
  try {
    const res = await api.get(ADMIN_ENDPOINTS.PENDING_CREATORS);
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error fetching pending creators:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch pending creators");
  }
};

export const approveCreator = async (creatorId: string) => {
  try {
    const res = await api.put(ADMIN_ENDPOINTS.APPROVE_CREATOR(creatorId));
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error approving creator:", error);
    throw new Error(error.response?.data?.message || "Failed to approve creator");
  }
};

export const rejectCreator = async (creatorId: string, rejectionReason: string) => {
  try {
    const res = await api.put(ADMIN_ENDPOINTS.REJECT_CREATOR(creatorId), { rejectionReason });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error rejecting creator:", error);
    throw new Error(error.response?.data?.message || "Failed to reject creator");
  }
};

export const fetchSubscriptionHistory = async (page: number, limit: number) => {
  try {
    const response = await api.get(ADMIN_ENDPOINTS.SUBSCRIPTIONS_HISTORY(page, limit));
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Error fetching subscription history:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch subscription history"
    );
  }
};


//////
export const getEvents = async () => {
  try {
    const response = await api.get(ADMIN_ENDPOINTS.PUBLIC_EVENTS);
    return { success: true, data: response.data };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch events'
    };
  }
};


export const getCreators = async (searchTerm: string) => {
  try {
    const res = await api.get(`${ADMIN_ENDPOINTS.CREATORS}?search=${encodeURIComponent(searchTerm)}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching creators:", err);
    throw err;
  }
};


export const toggleCreatorBlockStatus = async (creatorId: string) => {
  try {
    const res = await api.put(ADMIN_ENDPOINTS.TOGGLE_BLOCK_CREATOR(creatorId));
    return res.data;
  } catch (err) {
    console.error("Error updating creator status:", err);
    throw err;
  }
};

export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await api.post(ADMIN_ENDPOINTS.LOGIN, { username, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async (searchTerm: string) => {
  try {
    const response = await api.get(`${ADMIN_ENDPOINTS.USERS}?search=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleBlockUser = async (userId: string) => {
  try {
    const response = await api.put(ADMIN_ENDPOINTS.TOGGLE_BLOCK_USER(userId));
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }

};


export const createSubscription = async (payload: {
  name: string;
  price: number;
  days: number;
}) => {
  try {
    const response = await api.post(ADMIN_ENDPOINTS.CREATE_SUBSCRIPTION, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};


export const deleteSubscription = async (planId: string) => {
  try {
    const response = await api.delete(ADMIN_ENDPOINTS.DELETE_SUBSCRIPTION(planId));
    return response.data;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

export const getAllSubscriptions = async () => {
  try {
    const response = await api.get(ADMIN_ENDPOINTS.ALL_SUBSCRIPTIONS);
    return response.data; 
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("Failed to fetch all subscriptions:", error);
    throw new Error(error.response?.data?.message || "Fetch failed");
  }
};

