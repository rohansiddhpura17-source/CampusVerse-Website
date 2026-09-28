import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 60000,
});

// Request Interceptor: Attach defense-in-depth client identification header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers) {
      config.headers['X-CampusVerse-Client'] = 'web';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwrap { success: true, data } and handle 401
apiClient.interceptors.response.use(
  (response) => {
    // If backend uses standard envelope { success: true, data: T }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError<any>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Redirect to login if not already on an auth page
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    return Promise.reject(new Error(message));
  }
);
