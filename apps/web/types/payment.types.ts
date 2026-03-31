/**
 * Payment Types for Frontend
 */

export interface PaymentItem {
  subjects: string[];
  sheets: string[];
}

export interface Payment {
  id: number;
  userId: string | null;
  username: string | null;
  price: number;
  day: number | null;
  subjects: string[] | null;
  sheets: string[] | null;
  status: boolean;
  activate: boolean;
  activateCode: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePaymentRequest {
  userId: string;
  price: number;
  subjects?: string[];
  sheets?: string[];
  day?: number;
}
