import { PaymentRepository } from '../ports/index.js';
import { Payment } from '../domain/entities/index.js';

/**
 * Payment Use Case
 * Contains application business logic for payment operations
 */
export class PaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  /**
   * Get payment by ID
   */
  async getPaymentById(id: number): Promise<Payment | null> {
    return await this.paymentRepository.findById(id);
  }

  /**
   * Get payment by activate code
   */
  async getPaymentByActivateCode(code: string): Promise<Payment | null> {
    return await this.paymentRepository.findByActivateCode(code);
  }

  /**
   * Get user's payment history
   */
  async getUserPayments(userId: string): Promise<Payment[]> {
    return await this.paymentRepository.findByUserId(userId);
  }

  /**
   * Create new payment
   */
  async createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    return await this.paymentRepository.create(data);
  }

  /**
   * Update payment status (e.g., after Stripe webhook)
   */
  async updatePaymentStatus(id: number, status: boolean): Promise<Payment> {
    return await this.paymentRepository.updateStatus(id, status);
  }

  /**
   * Activate payment using activate code
   */
  async activatePayment(code: string): Promise<Payment> {
    const payment = await this.paymentRepository.findByActivateCode(code);

    if (!payment) {
      throw new Error('Invalid activate code');
    }

    if (!payment.isSuccessful()) {
      throw new Error('Payment not successful');
    }

    if (payment.isActivated()) {
      throw new Error('Payment already activated');
    }

    return await this.paymentRepository.activatePayment(payment.id);
  }

  /**
   * Get pending payments (successful but not activated)
   */
  async getPendingPayments(): Promise<Payment[]> {
    return await this.paymentRepository.findPendingPayments();
  }

  /**
   * Calculate payment details
   */
  async calculatePaymentExpiry(paymentId: number): Promise<Date | null> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment.calculateExpiryDate();
  }
}
