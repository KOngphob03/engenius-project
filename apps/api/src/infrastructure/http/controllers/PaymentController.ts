import { PaymentUseCase } from '../../../core/use-cases/index.js';
import { getErrorMessage } from '../../../shared/utils/error-handler.js';
import { Payment } from '../../../core/domain/entities/Payment.entity.js';

type CreatePaymentRequest = Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'isSuccessful' | 'isActivated' | 'calculateExpiryDate' | 'isExpired'>;

/**
 * Payment Controller
 * HTTP layer - delegates to use cases
 */
export class PaymentController {
  constructor(private readonly paymentUseCase: PaymentUseCase) {}

  /**
   * GET /payments/:id
   */
  async getPayment(id: number) {
    const payment = await this.paymentUseCase.getPaymentById(id);
    if (!payment) {
      return { error: 'Payment not found', status: 404 };
    }
    return { data: payment, status: 200 };
  }

  /**
   * GET /payments/activate/:code
   */
  async getPaymentByActivateCode(code: string) {
    const payment = await this.paymentUseCase.getPaymentByActivateCode(code);
    if (!payment) {
      return { error: 'Payment not found', status: 404 };
    }
    return { data: payment, status: 200 };
  }

  /**
   * GET /payments/user/:userId
   */
  async getUserPayments(userId: string) {
    const payments = await this.paymentUseCase.getUserPayments(userId);
    return { data: payments, status: 200 };
  }

  /**
   * POST /payments
   */
  async createPayment(data: CreatePaymentRequest) {
    try {
      const payment = await this.paymentUseCase.createPayment(data as any);
      return { data: payment, status: 201 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * PUT /payments/:id/status
   */
  async updatePaymentStatus(id: number, status: boolean) {
    try {
      const payment = await this.paymentUseCase.updatePaymentStatus(id, status);
      return { data: payment, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * POST /payments/activate
   */
  async activatePayment(code: string) {
    try {
      const payment = await this.paymentUseCase.activatePayment(code);
      return { data: payment, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * GET /payments/pending
   */
  async getPendingPayments() {
    const payments = await this.paymentUseCase.getPendingPayments();
    return { data: payments, status: 200 };
  }
}
