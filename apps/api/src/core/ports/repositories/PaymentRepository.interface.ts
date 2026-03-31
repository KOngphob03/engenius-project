import { Payment } from '../../domain/entities';

/**
 * Payment Repository Port (Interface)
 * Defines the contract for payment data access
 * Implementations are in Infrastructure layer
 */
export interface PaymentRepository {
  /**
   * Find payment by ID
   */
  findById(id: number): Promise<Payment | null>;

  /**
   * Find payment by activate code
   */
  findByActivateCode(code: string): Promise<Payment | null>;

  /**
   * Find payments by user ID
   */
  findByUserId(userId: string): Promise<Payment[]>;

  /**
   * Create new payment
   */
  create(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;

  /**
   * Update payment
   */
  update(id: number, payment: Partial<Omit<Payment, 'id' | 'createdAt'>>): Promise<Payment>;

  /**
   * Soft delete payment
   */
  delete(id: number): Promise<void>;

  /**
   * Find all payments (with pagination)
   */
  findAll(limit?: number, offset?: number): Promise<Payment[]>;

  /**
   * Update payment status
   */
  updateStatus(id: number, status: boolean): Promise<Payment>;

  /**
   * Activate payment
   */
  activatePayment(id: number): Promise<Payment>;

  /**
   * Find pending payments (not yet activated)
   */
  findPendingPayments(): Promise<Payment[]>;
}
