import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Authentication Types
export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
  role?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  isEmailVerified: boolean;
}

export class AuthService extends ApiService {
  // Register new user
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
        false // No auth required for registration
      );

      // Store tokens on successful registration
      if (response.success && response.data) {
        this.setAuthData(response.data);
      }

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Login user
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data,
        false // No auth required for login
      );

      // Store tokens on successful login
      if (response.success && response.data) {
        this.setAuthData(response.data);
      }

      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      if (this.isAuthenticated()) {
        await this.post(API_ENDPOINTS.AUTH.LOGOUT, {}, true);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Get current user profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const userData = localStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }

      // If no cached data, fetch from API
      // This would require a get user profile endpoint
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Store authentication data
  private setAuthData(data: AuthResponse): void {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_data', JSON.stringify({
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
      role: data.role || 'Customer',
    }));
  }

  // Clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }

  // Handle authentication errors
  private handleAuthError(error: any): Error {
    if (error.statusCode === 401) {
      this.clearAuthData();
      return new Error('Invalid credentials. Please try again.');
    }
    
    if (error.statusCode === 409) {
      return new Error('User already exists with this email.');
    }
    
    if (error.errors && error.errors.length > 0) {
      return new Error(error.errors[0].message);
    }
    
    return new Error('Authentication failed. Please try again.');
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return true;

    try {
      // Simple JWT token expiration check
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Get auth headers
  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create singleton instance
export const authService = new AuthService();