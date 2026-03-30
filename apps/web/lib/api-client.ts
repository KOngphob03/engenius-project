/**
 * API Client for Engenius Frontend
 * Connects to Backend API (ElysiaJS)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
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
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

/**
 * API Service - Specific API calls
 */
export const apiService = {
  // Health check
  healthCheck: () => apiClient.get<{ message: string; status: string }>('/'),

  // Auth APIs
  requestOTP: (email: string) =>
    apiClient.post<any>('/auth/request-otp', { email }),

  loginWithOTP: (email: string, otp: string) =>
    apiClient.post<any>('/auth/login', { email, otp }),

  logout: (userId: string) =>
    apiClient.post<any>('/auth/logout', { userId }),

  verifyToken: (token: string) =>
    apiClient.get<any>('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // User APIs
  getUsers: (limit = 100, offset = 0) =>
    apiClient.get<any>(`/users?limit=${limit}&offset=${offset}`),

  getUserById: (id: string) =>
    apiClient.get<any>(`/users/${id}`),

  getUserByEmail: (email: string) =>
    apiClient.get<any>(`/users/email/${email}`),

  createUser: (userData: any) =>
    apiClient.post<any>('/users', userData),

  updateUser: (id: string, userData: any) =>
    apiClient.put<any>(`/users/${id}`, userData),

  deleteUser: (id: string) =>
    apiClient.delete<any>(`/users/${id}`),

  verifyOtp: (otp: string) =>
    apiClient.post<any>('/users/verify-otp', { otp }),

  checkMembership: (id: string) =>
    apiClient.get<any>(`/users/${id}/membership`),

  // Payment APIs
  getPayments: () =>
    apiClient.get<any>('/payments'),

  getPaymentById: (id: number) =>
    apiClient.get<any>(`/payments/${id}`),

  getUserPayments: (userId: string) =>
    apiClient.get<any>(`/payments/user/${userId}`),

  getPendingPayments: () =>
    apiClient.get<any>('/payments/pending'),

  createPayment: (paymentData: any) =>
    apiClient.post<any>('/payments', paymentData),

  updatePaymentStatus: (id: number, status: boolean) =>
    apiClient.put<any>(`/payments/${id}/status`, { status }),

  activatePayment: (code: string) =>
    apiClient.post<any>('/payments/activate', { code }),
};

export default apiClient;
