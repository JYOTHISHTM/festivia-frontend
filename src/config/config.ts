

// //src/config//config.ts
// export const BASE_URL = 'http://localhost:5001';
export const BASE_URL = 'http://festivia-api.jothish.online'
const MAINTENANCE_MODE = false;



// const BASE_URL = process.env.REACT_APP_BASE_URL 
// const MAINTENANCE_MODE = process.env.REACT_APP_MAINTENANCE_MODE === 'true';


export const API_CONFIG = {
  BASE_URL,
  MAINTENANCE_MODE,

  USER_ENDPOINTS: {
    EVENTS: '/users/public-events',
    WALLET: '/users/wallet',
    LOGOUT: 'users/logout',
    CHANGE_PASSWORD: '/users/change-password',
    EVENT_TYPES: '/users/event-types',
    WALLET_BOOKING: '/users/wallet-ticket-booking',
    LAYOUT_BY_ID: '/users/layout',
    EVENT_PROFILE_INFO: '/users/event-profile-info',
    ALL_CREATOR_POSTS: '/users/all-posts',
    BOOK_TICKET: '/users/events/book-ticket',
    HOME_EVENTS: '/users/home-events',
    EVENTS_BY_LOCATION: '/users/events-by-location',
    SAVE_LOCATION: '/users/location',
    CHAT_WITH_CREATORS: '/users/chat/user',
    USER_TICKETS: (userId: string) => `/users/${userId}/tickets`,
    POST_DETAILS_PAGE: "/users/post-details-page",
    AVAILABLE_PRIVATE_CREATORS: '/users/available-private-event-creators',
    CHAT_HISTORY: (roomId: string) => `/users/chat/${roomId}`,
    EVENT: (id: string) => `/users/event/${id}`,
    EVENT_PROFILE: (creatorId: string) => `/users/event-profile-info?creatorId=${creatorId}`,
    SEND_OTP: 'users/send-otp',
    VERIFY_OTP_FORGOT_PASSWORD: 'users/verify-otp-forgot-password',
    LOGIN: 'users/login',
    CANCEL_TICKET: (userId: string, ticketId: string) => `/users/${userId}/tickets/${ticketId}/cancel`,
    RESET_PASSWORD: 'users/reset-password',
    REGISTER: 'users/register',
    UPLOAD: 'users/upload',
    RESEND_OTP: '/users/resend-otp',
    VERIFY_OTP: '/users/verify-otp',
    WALLET_ENDPOINT: 'users/wallet',
    ADD_MONEY: 'users/wallet/add',
    CHECKOUT_SESSION: 'users/wallet/checkout-session',




  },





  ADMIN_ENDPOINTS: {
    SUBSCRIPTIONS_HISTORY: (page: number, limit: number) =>
      `/admin/subscriptions-history?page=${page}&limit=${limit}`,
    LOGIN: '/admin/login',
    LOGOUT: 'admin/logout',
    PUBLIC_EVENTS: '/admin/public-events',
    USERS: '/admin/users',
    TOGGLE_BLOCK_USER: (userId: string) => `/admin/toggle-block/${userId}`,
    CREATORS: '/admin/creator',
    TOGGLE_BLOCK_CREATOR: (creatorId: string) => `/admin/toggle-block-creator/${creatorId}`,
    PENDING_CREATORS: '/admin/pending-creators',
    APPROVE_CREATOR: (creatorId: string) => `/admin/approve-creator/${creatorId}`,
    REJECT_CREATOR: (creatorId: string) => `/admin/reject-creator/${creatorId}`,
    DASHBOARD: '/admin/dashboard',
    SUBSCRIPTION_HISTORY: '/admin/subscriptions-history',
    ALL_SUBSCRIPTIONS: '/admin/all-subscriptions',
    CREATE_SUBSCRIPTION: `/admin/create-subscription`,
    DELETE_SUBSCRIPTION: (planId: string) => `/admin/delete-subscription/${planId}`,
    CREATOR_REAPPLY: (creatorId: string) => `admin/creator-reapply/${creatorId}`,
    CREATOR_STATUS: "/admin/creator-status",



  },






  CREATOR: {
    BASE_URL: `${BASE_URL}/creator`,
    ENDPOINTS: {
      SIGN_UP: '/sign-up',
      VERIFY_OTP: '/verify-otp',
      LOGOUT: 'creator/logout',
      RESEND_OTP: '/resend-otp',
      TICKET_SUMMARY: '/ticket-summary',
      GET_LAYOUT_BY_ID: '/layout',
      MESSAGES_USERS: (creatorId: string) => `/${creatorId}/messages/users`,
      CHECK_LAYOUTS: (creatorId: string) => `/check-layouts/${creatorId}`,
      CHAT_HISTORY: (roomId: string) => `/chat/${roomId}`,
      TICKET_USERS: '/ticket-users',
      GET_EVENT: (id: string) => `/event/${id}`,
      UPDATE_DESCRIPTION: (id: string) => `/update-description/${id}`,
      TOGGLE_LISTING: (id: string) => `/toggle-list/${id}`,
      UPDATE_EVENT_PROFILE: '/update-event-profile',
      UPDATE_EVENT_PROFILE_TYPE: "/update-event-profile",
      GET_EVENT_PROFILE_INFO: "/event-profile-info",
      ALL_LISTED_EVENTS: "/all-listed-events",
      CHAT_WITH_USERS: "/chat/creator",

      POST_DETAILS: "/post-details",
      SUBSCRIPTION: "/subscription",
      ALL_SUBSCRIPTIONS: "/all-subscriptions",
      CREATE: '/create',
      CREATE_EVENT: '/create-event',
      UPLOAD_MEDIA: '/upload',
      ALL_POSTS: '/all-posts',
      UPDATE_PROFILE_IMAGE: '/update-profile-image',
      SEND_OTP: 'creator/send-otp',
      VERIFY_OTP_FORGOT_PASSWORD: 'creator/verify-otp-forgot-password',
      LOGIN: 'creator/login',
      RESEST_PASSWORD: '/reset-password',
      LAYOUTS: (creatorId: string) => `creator/layouts/${creatorId}`,
      BUY_USING_WALLET: 'creator/buy-using-wallet',
      CANCEL_SUBSCRIPTION: (creatorId: string) => `/creator/cancel-subscription/${creatorId}`,
      SUBSCRIPTION_HISTORY: '/subscription-history',
      WALLET_ENDPOINT: 'creator/wallet',
      ADD_MONEY_TO_WALLET: 'creator/wallet/add',
      CHECKOUT_SESSION: 'creator/wallet/checkout-session'



    }
  }
}
