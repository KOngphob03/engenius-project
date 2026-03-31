/**
 * User Types for Frontend
 */

export type UserRole = 'user' | 'admin';

export interface Subject {
  id: string;
  name: string;
  sheets: string[];
}

export interface ExaminationFields {
  [key: string]: string | number | boolean | null | undefined;
}

export interface User {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  university: string | null;
  department: string | null;
  exp: string | null;
  expKorpor: string | null;
  expOtp: string | null;
  subject: Subject | null;
  role: UserRole[];
  createdAt: string;
  updatedAt: string;
  time: number;
  activated: boolean;
  otp: string | null;
  examinationFields: ExaminationFields | null;
  token: string | null;
  profile: string | null;
  deletedAt: string | null;
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
