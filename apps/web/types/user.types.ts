/**
 * User Types for Frontend
 */

export interface User {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  university: string | null;
  department: string | null;
  exp: Date | null;
  expKorpor: Date | null;
  expOtp: Date | null;
  subject: any;
  role: string[];
  createdAt: Date;
  updatedAt: Date;
  time: number;
  activated: boolean;
  otp: string | null;
  examinationFields: any;
  token: string | null;
  profile: string | null;
  deletedAt: Date | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
