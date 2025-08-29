import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../../config/config';

const BASE_URL = API_CONFIG.CREATOR.BASE_URL;
const BASE_URL1 = API_CONFIG.BASE_URL;

export const creatorService = {

  getCurrentSubscription: async (token: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.SUBSCRIPTION}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching current subscription:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch current subscription");
    }
  },

  getAllSubscriptions: async () => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.ALL_SUBSCRIPTIONS}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching all subscriptions:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch all subscriptions");
    }
  },


  getEventPostById: async (eventId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.POST_DETAILS}/${eventId}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("❌ Failed to fetch event:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
  },


  getCreatorStatus: async (creatorId: string) => {
    try {
      const url = `${BASE_URL1}${API_CONFIG.ADMIN_ENDPOINTS.CREATOR_STATUS}/${creatorId}`;
      const res = await fetch(url);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch creator status");
      }

      return data;
    } catch (error) {
      console.error("Error in getCreatorStatus:", error);
      throw error;
    }
  },


  getCreatorChats: async (creatorId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.CHAT_WITH_USERS}/${creatorId}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {

const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching chats:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch chats");
    }
  },


  getAllListedEvents: async (creatorId: string, page: number = 1) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.ALL_LISTED_EVENTS}/${creatorId}?page=${page}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching listed events:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch listed events");
    }
  },



  updateEventProfile: async (creatorId: string, field: string, value: any) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.UPDATE_EVENT_PROFILE_TYPE}`;
      await axios.post(url, {
        field,
        value,
        creator: { id: creatorId },
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error updating event profile:", error);
      throw new Error(error.response?.data?.message || "Failed to update event profile");
    }
  },

  getEventProfileInfo: async (creatorId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.GET_EVENT_PROFILE_INFO}?creatorId=${creatorId}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching event profile info:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch event profile");
    }
  },




  updateEventProfileType: async (
    creatorId: string,
    field: string,
    value: any
  ) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.UPDATE_EVENT_PROFILE_TYPE}`;
      await axios.post(url, {
        field,
        value,
        creator: { id: creatorId },
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error updating event profile:", error);
      throw new Error(error.response?.data?.message || "Failed to update event profile");
    }
  },


  updateEventProfileField: async (
    creatorId: string,
    field: string,
    value: string
  ) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.UPDATE_EVENT_PROFILE}`;
      await axios.post(url, {
        field,
        value,
        creator: { id: creatorId },
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error updating event profile:", error);
      throw new Error(error.response?.data?.message || "Failed to update event profile");
    }
  },





  getEventById: async (eventId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.GET_EVENT(eventId)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching event:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
  },

  updateEventDescription: async (eventId: string, description: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.UPDATE_DESCRIPTION(eventId)}`;
      await axios.patch(url, { description });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error updating description:", error);
      throw new Error("Failed to update description");
    }
  },

  toggleEventListing: async (eventId: string, isListed: boolean) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.TOGGLE_LISTING(eventId)}`;
      await axios.patch(url, { isListed });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error toggling listing status:", error);
      throw new Error("Failed to update listing status");
    }
  },


  getTicketUsers: async (creatorId: string, page: number, limit: number) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.TICKET_USERS}`;
      const res = await axios.get(url, {
        params: { creatorId, page, limit },
      });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching ticket users:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch ticket users");
    }
  },


  getChatHistory: async (roomId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.CHAT_HISTORY(roomId)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error fetching chat history:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch chat history");
    }
  },


  checkLayoutSelected: async (creatorId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.CHECK_LAYOUTS(creatorId)}`;
      const response = await fetch(url);
      console.log("res", response);


      if (!response.ok) {
        throw new Error("Failed to fetch layout data");
      }

      const layoutArray = await response.json();
      return layoutArray;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Error checking layouts:", error);
      throw new Error(error.message || "Error fetching seat layouts");
    }
  },

  getMessageUsers: async (creatorId: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.MESSAGES_USERS(creatorId)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  getLayoutById: async (layoutId: string, creatorId: string, token: string) => {
    try {
      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.GET_LAYOUT_BY_ID}/${layoutId}`;

      const res = await axios.get(url, {
        params: { creatorId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || "Failed to fetch layout");
    }
  },



  getTicketSummary: async (
    creatorId: string,
    page: number,
    limit: number,
    selectedEventId?: string
  ) => {
    try {
      const params = new URLSearchParams({
        creatorId,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (selectedEventId) {
        params.append("selectedEventId", selectedEventId);
      }

      const url = `${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.TICKET_SUMMARY}?${params.toString()}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Failed to fetch ticket summary";
      throw new Error(message);
    }
  },











  signUp: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await axios.post(`${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.SIGN_UP}`, {
        ...userData,
        role: "creator",
      });
      return { success: true, data: response.data };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return {
        success: false,
        error: error.response?.data?.message || "Something went wrong",
      };
    }
  },

  verifyOtp: async (email: string, otp: string, userType: "creator") => {
    try {
      const response = await axios.post(`${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.VERIFY_OTP}`, {
        email,
        otp,
        userType,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return {
        success: false,
        error: error.response?.data?.message || "Invalid OTP",
      };
    }
  },

  resendOtp: async (email: string) => {
    try {
      console.log("servi in creator ");
      
      await axios.post(`${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.RESEND_OTP}`, {
        email,
        type: "creator",
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to resend OTP. Try again later." };
    }
  },
};

export const createEvent = async (formData: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.CREATE}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: response.data };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      success: false,
      error: error.response?.data?.message || 'Event creation failed',
    };
  }
};

export const createEventForm = async (form: FormData, token: string | null) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.CREATE_EVENT}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
    });
    return { success: true, data: response.data };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      success: false,
      error: error.response?.data?.message || 'Event creation failed',
    };
  }
};

export const uploadMedia = async (formData: FormData) => {
  try {
    const response = await fetch(
      `${API_CONFIG.CREATOR.BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.UPLOAD_MEDIA}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const error = err as Error
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
};

export const getCreatorPosts = async (creatorId: string) => {
  try {
    const response = await fetch(`${API_CONFIG.CREATOR.BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.ALL_POSTS}?creatorId=${creatorId}`);
    if (!response.ok) throw new Error('Failed to fetch creator posts');
    return { success: true, data: await response.json() };
  } catch (err) {
    const error = err as Error
    return { success: false, error: error.message || 'Error fetching posts' };
  }
};

export const updateProfileImage = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_CONFIG.CREATOR.BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.UPDATE_PROFILE_IMAGE}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Image upload failed');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const error = err as Error
    return { success: false, error: error.message || 'Error uploading image' };
  }
};

export const getCreatorSubscriptionHistory = async (creatorId: string, token: string) => {
  try {
    const response = await fetch(
      `${API_CONFIG.CREATOR.BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.SUBSCRIPTION_HISTORY}?creatorId=${creatorId}&all=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to fetch subscription history');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const error = err as Error
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
};

export const getPaginatedSubscriptionHistory = async (creatorId: string, page: number, token: string) => {
  try {
    const url = `${API_CONFIG.CREATOR.BASE_URL}${API_CONFIG.CREATOR.ENDPOINTS.SUBSCRIPTION_HISTORY}?page=${page}&creatorId=${creatorId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to fetch subscription history');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    const error = err as Error
    return {
      success: false,
      error: error.message || 'Error fetching subscription history',
    };
  }
};