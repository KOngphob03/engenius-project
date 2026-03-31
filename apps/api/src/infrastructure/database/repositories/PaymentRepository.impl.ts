import { eq, and, isNull, desc } from 'drizzle-orm';
import { db } from '../../../shared/config/database.js';
import { paymentStripe, type PaymentStripe as PaymentModel } from '../drizzle/schema/index.js';
import { Payment, PaymentRepository as IPaymentRepository } from '../../../core/index.js';

/**
 * Payment Repository Implementation
 * Implements PaymentRepository port using Drizzle ORM
 */
export class PaymentRepository implements IPaymentRepository {
  /**
   * Map database model to domain entity
   */
  private toDomain(model: PaymentModel): Payment {
    return new Payment(
      model.id!,
      model.userId,
      model.username,
      parseFloat(model.price),
      model.day,
      model.subjects,
      model.sheets,
      model.status || false,
      model.activate || false,
      model.activateCode,
      model.createdAt!,
      model.updatedAt!,
      model.deletedAt,
    );
  }

  async findById(id: number): Promise<Payment | null> {
    const result = await db
      .select()
      .from(paymentStripe)
      .where(eq(paymentStripe.id, id))
      .limit(1);

    return result[0] ? this.toDomain(result[0]) : null;
  }

  async findByActivateCode(code: string): Promise<Payment | null> {
    const result = await db
      .select()
      .from(paymentStripe)
      .where(eq(paymentStripe.activateCode, code))
      .limit(1);

    return result[0] ? this.toDomain(result[0]) : null;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const result = await db
      .select()
      .from(paymentStripe)
      .where(eq(paymentStripe.userId, userId))
      .orderBy(desc(paymentStripe.createdAt));

    return result.map(model => this.toDomain(model));
  }

  async create(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const [newPayment] = await db
      .insert(paymentStripe)
      .values({
        userId: payment.userId,
        username: payment.username,
        price: payment.price.toString(),
        day: payment.day,
        subjects: payment.subjects,
        sheets: payment.sheets,
        status: payment.status,
        activate: payment.activate,
        activateCode: payment.activateCode,
        deletedAt: payment.deletedAt,
      })
      .returning();

    return this.toDomain(newPayment);
  }

  async update(id: number, payment: Partial<Omit<Payment, 'id' | 'createdAt'>>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(paymentStripe)
      .set({
        ...payment,
        price: payment.price?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(paymentStripe.id, id))
      .returning();

    return this.toDomain(updatedPayment);
  }

  async delete(id: number): Promise<void> {
    await db
      .update(paymentStripe)
      .set({ deletedAt: new Date() })
      .where(eq(paymentStripe.id, id));
  }

  async findAll(limit = 100, offset = 0): Promise<Payment[]> {
    const result = await db
      .select()
      .from(paymentStripe)
      .where(isNull(paymentStripe.deletedAt))
      .orderBy(desc(paymentStripe.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(model => this.toDomain(model));
  }

  async updateStatus(id: number, status: boolean): Promise<Payment> {
    const [updatedPayment] = await db
      .update(paymentStripe)
      .set({ status, updatedAt: new Date() })
      .where(eq(paymentStripe.id, id))
      .returning();

    return this.toDomain(updatedPayment);
  }

  async activatePayment(id: number): Promise<Payment> {
    const [updatedPayment] = await db
      .update(paymentStripe)
      .set({ activate: true, updatedAt: new Date() })
      .where(eq(paymentStripe.id, id))
      .returning();

    return this.toDomain(updatedPayment);
  }

  async findPendingPayments(): Promise<Payment[]> {
    const result = await db
      .select()
      .from(paymentStripe)
      .where(and(eq(paymentStripe.status, true), eq(paymentStripe.activate, false)))
      .orderBy(desc(paymentStripe.createdAt));

    return result.map(model => this.toDomain(model));
  }
}
