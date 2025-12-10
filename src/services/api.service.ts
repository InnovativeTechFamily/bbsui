import { API_CONFIG, API_ENDPOINTS } from './api.config';
import type { ApiResponse, ApiError } from './api.config';

// Re-export types that are used by other services
export type { ApiResponse, ApiError } from './api.config';

// API Error Handler
export class ApiErrorHandler extends Error {
  public statusCode: number;
  public errors?: ApiError[];
  
  constructor(message: string, statusCode: number, errors?: ApiError[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// API Service Base Class
export class ApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Set auth token in localStorage
  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Remove auth token
  private removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Build request headers
  private buildHeaders(isAuthRequired: boolean = true): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    if (isAuthRequired) {
      const token = this.getAuthToken();
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  // Make HTTP request with retry logic
  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    retryCount: number = 0
  ): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retryCount < this.retryAttempts) {
        const refreshed = await this.refreshAuthToken();
        if (refreshed) {
          // Retry the original request with new token
          const newOptions = {
            ...options,
            headers: this.buildHeaders(true),
          };
          return this.makeRequest<T>(url, newOptions, retryCount + 1);
        }
      }

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new ApiErrorHandler(
          data.message || 'API request failed',
          response.status,
          data.errors
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }

      // Network or other errors
      if (retryCount < this.retryAttempts) {
        await this.delay(this.retryDelay * Math.pow(2, retryCount));
        return this.makeRequest<T>(url, options, retryCount + 1);
      }

      throw new ApiErrorHandler(
        'Network error. Please check your connection.',
        0
      );
    }
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Refresh auth token
  private async refreshAuthToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        this.removeAuthToken();
        return false;
      }

      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.removeAuthToken();
        return false;
      }

      const data = await response.json();
      this.setAuthToken(data.data.token);
      localStorage.setItem('refresh_token', data.data.refreshToken);
      
      return true;
    } catch (error) {
      this.removeAuthToken();
      return false;
    }
  }

  // GET request
  protected async get<T>(endpoint: string, isAuthRequired: boolean = true): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(isAuthRequired);
    
    return this.makeRequest<ApiResponse<T>>(url, {
      method: 'GET',
      headers,
    });
  }

  // POST request
  protected async post<T>(
    endpoint: string,
    data: any,
    isAuthRequired: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(isAuthRequired);
    
    return this.makeRequest<ApiResponse<T>>(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // PUT request
  protected async put<T>(
    endpoint: string,
    data: any,
    isAuthRequired: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(isAuthRequired);
    
    return this.makeRequest<ApiResponse<T>>(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  protected async delete<T>(
    endpoint: string,
    isAuthRequired: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(isAuthRequired);
    
    return this.makeRequest<ApiResponse<T>>(url, {
      method: 'DELETE',
      headers,
    });
  }

  // Logout method
  public logout(): void {
    this.removeAuthToken();
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}