// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.swiftbus.com/api', // Replace with your actual API base URL
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  BUSES: {
    SEARCH: '/buses/search',
    GET_BY_ID: (busId: string) => `/buses/${busId}`,
    SEAT_LAYOUT: (busId: string) => `/buses/${busId}/seat-layout`,
  },
  SEATS: {
    LOCK: '/seats/lock',
    EXTEND_LOCK: '/seats/lock/extend',
    RELEASE_LOCK: '/seats/lock/release',
    LOCK_STATUS: (lockId: string) => `/seats/lock/${lockId}/status`,
  },
  BOOKINGS: {
    CREATE: '/bookings/create',
    GET_BY_ID: (bookingId: string) => `/bookings/${bookingId}`,
    MY_BOOKINGS: '/bookings/my-bookings',
    CANCEL: (bookingId: string) => `/bookings/${bookingId}/cancel`,
  },
  PAYMENTS: {
    INITIATE: '/payments/initiate',
    CALLBACK: '/payments/callback',
    STATUS: (paymentId: string) => `/payments/${paymentId}/status`,
  },
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  items: T[];
}