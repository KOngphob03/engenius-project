/**
 * API Client for Engenius Frontend
 * Connects to Backend API (ElysiaJS)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.error("Missing NEXT_PUBLIC_API_URL environment variable.");
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL as string) {
    this.baseUrl = baseUrl || "";
  }

  /**
   * Generic request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Something went wrong',
      }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

import { User, LoginResponse, ApiResponse } from "@/types/user.types";
import { Payment, CreatePaymentRequest } from "@/types/payment.types";

/**
 * API Service - Specific API calls
 */
export const apiService = {
  get: <T>(endpoint: string) => apiClient.get<ApiResponse<T>>(endpoint),

  healthCheck: () => apiClient.get<ApiResponse<{ message: string; status: string }>>('/'),

  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password }),

  logout: (userId: string) =>
    apiClient.post<ApiResponse<{ success: boolean }>>('/auth/logout', { userId }),

  verifyToken: (token: string) =>
    apiClient.get<ApiResponse<User>>('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  searchUserByEmail: (email: string) =>
    apiClient.get<ApiResponse<User>>(`/users/email/${encodeURIComponent(email)}`),

  getAllUsers: (limit = 100, offset = 0) =>
    apiClient.get<ApiResponse<User[]>>(`/users?limit=${limit}&offset=${offset}`),

  getUserPayments: (userId: string) =>
    apiClient.get<ApiResponse<Payment[]>>(`/payments/user/${userId}`),

  getAllPayments: (limit = 100, offset = 0) =>
    apiClient.get<ApiResponse<Payment[]>>(`/payments?limit=${limit}&offset=${offset}`),

  getPaymentById: (id: number) =>
    apiClient.get<ApiResponse<Payment>>(`/payments/${id}`),

  createPayment: (data: CreatePaymentRequest) =>
    apiClient.post<ApiResponse<Payment>>('/payments', data),

  updatePaymentStatus: (id: number, status: string | boolean) =>
    apiClient.put<ApiResponse<Payment>>(`/payments/${id}/status`, { status }),
};

export default apiClient;
