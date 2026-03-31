import { pgTable, uuid, varchar, timestamp, boolean, integer, numeric, json, jsonb } from 'drizzle-orm/pg-core';
import { Subject, ExaminationFields } from '../../../../core/domain/entities/User.entity.js';

/**
 * Users table - ตารางผู้ใช้งาน
 */
export const users = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstname: varchar('firstname', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  phone: varchar('phone'),
  university: varchar('university'),
  department: varchar('department'),
  exp: timestamp('exp', { mode: 'date' }),
  expKorpor: timestamp('exp_korpor', { mode: 'date' }),
  expOtp: timestamp('exp_otp', { mode: 'date' }),
  subject: json('subject').$type<Subject | null>(),
  role: json('role').$type<string[] | null>(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  time: integer('time').default(0),
  activated: boolean('activated').default(false),
  otp: varchar('otp'),
  examinationFields: json('examination_fields').$type<ExaminationFields | null>(),
  token: varchar('token'),
  profile: varchar('profile'),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
});

/**
 * Payment Stripe table - ตารางการชำระเงิน
 */
export const paymentStripe = pgTable('payment_stripe', {
  id: integer('id').generatedByDefaultAsIdentity('payment_stripe_id_seq').primaryKey(),
  userId: varchar('user_id'),
  username: varchar('username'),
  price: numeric('price', { precision: 10, scale: 2 }),
  day: integer('day'),
  subjects: jsonb('subjects').$type<string[] | null>(),
  sheets: jsonb('sheets').$type<string[] | null>(),
  status: boolean('status').default(false),
  activate: boolean('activate').default(false),
  activateCode: varchar('activate_code'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PaymentStripe = typeof paymentStripe.$inferSelect;
export type NewPaymentStripe = typeof paymentStripe.$inferInsert;
