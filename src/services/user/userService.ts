import axios from 'axios';
import { API_CONFIG } from '../../config/config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userService = {


  getChatHistory: async (roomId: string) => {
    try {
      const url = API_CONFIG.USER_ENDPOINTS.CHAT_HISTORY(roomId);
      const res = await api.get(url);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error:  "Failed to load chat history",
      };
    }
  },

  getAvailablePrivateEventCreators: async () => {
    try {
      const res = await api.get(API_CONFIG.USER_ENDPOINTS.AVAILABLE_PRIVATE_CREATORS);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch private event creators",
      };
    }
  },
  getEventDetailsById: async (eventId: string) => {
    try {
      const url = `${API_CONFIG.USER_ENDPOINTS.POST_DETAILS_PAGE}/${eventId}`;
      const res = await api.get(url);
      return { success: true, data: res.data };
    } catch (error: any) {
      console.error("Error fetching event details:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch event details",
      };
    }
  },
  getUserTickets: async (userId: string, page: number = 1) => {
    try {
      const res = await api.get(`${API_CONFIG.USER_ENDPOINTS.USER_TICKETS(userId)}?page=${page}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      console.error("Failed to fetch tickets:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch tickets",
      };
    }
  },



  getUserChats: async (userId: string) => {
    try {
      const res = await api.get(`${API_CONFIG.USER_ENDPOINTS.CHAT_WITH_CREATORS}/${userId}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      console.error("Error fetching user chats:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user chats",
      };
    }
  },


  getHomeEvents: async () => {
    try {
      const res = await api.get(API_CONFIG.USER_ENDPOINTS.HOME_EVENTS);
      return { success: true, data: res.data };
    } catch (err) {
                  const error=err as Error
      console.error("Failed to fetch home events:", error);
      return { success: false, error: "Failed to fetch home events" };
    }
  },

  getEventsByLocation: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // const token = localStorage.getItem('userToken');
      const res = await api.get(API_CONFIG.USER_ENDPOINTS.EVENTS_BY_LOCATION, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: res.data };
    } catch (err) {
                  const error=err as Error
      console.error("Failed to fetch location events:", error);
      return { success: false, error: "Failed to fetch events by location" };
    }
  },

  saveUserLocation: async (location: string, latitude: number, longitude: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      // const token = localStorage.getItem('userToken');
      const res = await api.put(API_CONFIG.USER_ENDPOINTS.SAVE_LOCATION, {
        location,
        latitude,
        longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: res.data };
    } catch (err) {
                  const error=err as Error
      console.error("Failed to save location:", error);
      return { success: false, error: "Failed to save location" };
    }
  },



  bookTicket: async (userId: string, eventId: string) => {
    try {
      const url = `${API_CONFIG.USER_ENDPOINTS.BOOK_TICKET}/${userId}`;
      const res = await api.post(url, { eventId });
      return { success: true, sessionUrl: res.data.sessionUrl };
    } catch (error: any) {
      console.error("Booking failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Booking failed",
      };
    }
  },

  getCreatorProfile: async (creatorId: string) => {
    try {
      const url = `${API_CONFIG.USER_ENDPOINTS.EVENT_PROFILE_INFO}?creatorId=${creatorId}`;
      const res = await api.get(url);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to load profile",
      };
    }
  },

  getCreatorPosts: async (creatorId: string) => {
    try {
      const url = `${API_CONFIG.USER_ENDPOINTS.ALL_CREATOR_POSTS}?creatorId=${creatorId}`;
      const res = await api.get(url);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch events",
      };
    }
  },


  getLayoutWithEvent: async (layoutId: string) => {
    try {
      const res = await api.get(`${API_CONFIG.USER_ENDPOINTS.LAYOUT_BY_ID}/${layoutId}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load layout',
      };
    }
  },

  walletTicketBooking: async (payload: {
    userId: string;
    totalAmount: number;
    bookingDetails: {
      eventId: string;
      eventName: string;
      selectedSeats: any[];
      seatLayoutId: string;
      date: Date;
    };
  }) => {
    try {
      const res = await api.post(API_CONFIG.USER_ENDPOINTS.WALLET_BOOKING, payload);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Booking failed',
      };
    }
  },



  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      // const token = localStorage.getItem('userToken');
      const response = await api.put(
        API_CONFIG.USER_ENDPOINTS.CHANGE_PASSWORD,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to update password',
      };
    }
  },

  getEvents: async (filters: {
    search: string;
    location: string;
    eventType: string;

    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get(API_CONFIG.USER_ENDPOINTS.EVENTS, {
        params: {
          ...filters,
          page: filters.page || 1,
          limit: filters.limit || 9,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch events',
      };
    }
  },

  getEventTypes: async () => {
    try {
      const response = await api.get(API_CONFIG.USER_ENDPOINTS.EVENT_TYPES);
      return { success: true, data: response.data };
    } catch (err) {
                  const error=err as Error
      return {
        success: false,
        error: error.message || 'Failed to get event types',
      };
    }
  },

  logout: async () => {
    try {
      const response = await api.get(API_CONFIG.USER_ENDPOINTS.LOGOUT, {
        withCredentials: true,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed',
      };
    }
  },
};
