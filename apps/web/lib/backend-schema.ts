/**
 * Drizzle ORM Schema - Engenius Project
 *
 * Database Schema สำหรับระบบ Engenius
 * ประกอบด้วย:
 * - Better Auth Tables: user, session, account, verification
 * - Business Tables: customers, transactions, invoices
 *
 * @database PostgreSQL
 * @orm Drizzle ORM
 */

import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ============================================================
// BETTER AUTH TABLES
// ตารางสำหรับระบบ Authentication ตามมาตรฐาน Better Auth
// ============================================================

/**
 * Table: users
 *
 * ตารางเก็บข้อมูลผู้ใช้งานระบบ (Admin)
 */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

/**
 * Table: sessions
 *
 * ตารางเก็บข้อมูล Session การเข้าใช้งานของผู้ใช้
 */
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

/**
 * Table: accounts
 *
 * ตารางเก็บข้อมูลบัญชีที่เชื่อมโยงกับผู้ใช้ (OAuth, etc.)
 */
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 50 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

/**
 * Table: verifications
 *
 * ตารางเก็บข้อมูลการยืนยันตัวตน (Email Verification, etc.)
 */
export const verifications = pgTable("verifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// ============================================================
// BUSINESS TABLES
// ตารางสำหรับระบบธุรกิจ ใบกำกับภาษี
// ============================================================

/**
 * Table: customers
 *
 * ตารางเก็บข้อมูลลูกค้า
 */
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  // ข้อมูลส่วนตัว
  name: text("name").notNull(),
  taxId: varchar("tax_id", { length: 13 }).unique(), // เลขประจำตัวผู้เสียภาษี
  branch: text("branch").notNull().default("สำนักงานใหญ่"),
  // ที่อยู่
  address: text("address"),
  district: text("district"), // อำเภอ/เขต
  province: text("province"), // จังหวัด
  postalCode: varchar("postal_code", { length: 5 }), // รหัสไปรษณีย์
  // ข้อมูลติดต่อ
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/**
 * Table: transactions
 *
 * ตารางเก็บรายการชำระเงิน
 */
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  // วันที่และเวลาชำระ
  paymentDate: varchar("payment_date", { length: 50 }).notNull(), // "28 มี.ค. 2026"
  paymentTime: varchar("payment_time", { length: 20 }).notNull(), // "14:32:00 น."
  // ยอดเงิน
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(), // 123456.78
  // สถานะการชำระ
  status: varchar("status", { length: 20 })
    .notNull()
    .default("paid"), // paid, pending, cancelled, refunded
  notes: text("notes"), // หมายเหตุเพิ่มเติม
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

/**
 * Table: invoices
 *
 * ตารางเก็บข้อมูลใบกำกับภาษี
 */
export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .notNull()
    .references(() => transactions.id, { onDelete: "cascade" }),
  // เลขที่ใบกำกับภาษี (เช่น INV-2026-001)
  invoiceNumber: varchar("invoice_number", { length: 50 })
    .notNull()
    .unique(),
  // ยอดเงิน
  amountBeforeTax: decimal("amount_before_tax", {
    precision: 12,
    scale: 2,
  }).notNull(), // ยอดก่อนภาษี
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull(), // ภาษี 7%
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(), // ยอดรวมสุทธิ
  // ข้อมูลเพิ่มเติม
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull().default("0.07"), // อัตราภาษี 7%
  notes: text("notes"), // หมายเหตุ
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ============================================================
// RELATIONSHIPS
 * ความสัมพันธ์ระหว่างตารางต่างๆ
// ============================================================

/**
 * Relations สำหรับ users
 */
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  verifications: many(verifications),
}))

/**
 * Relations สำหรับ sessions
 */
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

/**
 * Relations สำหรับ accounts
 */
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

/**
 * Relations สำหรับ verifications
 */
export const verificationsRelations = relations(verifications, ({ one }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
}))

/**
 * Relations สำหรับ customers
 */
export const customersRelations = relations(customers, ({ many }) => ({
  transactions: many(transactions),
}))

/**
 * Relations สำหรับ transactions
 */
export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  customer: one(customers, {
    fields: [transactions.customerId],
    references: [customers.id],
  }),
  invoices: many(invoices),
}))

/**
 * Relations สำหรับ invoices
 */
export const invoicesRelations = relations(invoices, ({ one }) => ({
  transaction: one(transactions, {
    fields: [invoices.transactionId],
    references: [transactions.id],
  }),
}))

// ============================================================
// TYPE EXPORTS
 * ประเภทข้อมูลสำหรับใช้งานใน TypeScript
// ============================================================

/**
 * Type สำหรับการสร้าง User ใหม่
 */
export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect

/**
 * Type สำหรับการสร้าง Session ใหม่
 */
export type NewSession = typeof sessions.$inferInsert
export type Session = typeof sessions.$inferSelect

/**
 * Type สำหรับการสร้าง Account ใหม่
 */
export type NewAccount = typeof accounts.$inferInsert
export type Account = typeof accounts.$inferSelect

/**
 * Type สำหรับการสร้าง Verification ใหม่
 */
export type NewVerification = typeof verifications.$inferInsert
export type Verification = typeof verifications.$inferSelect

/**
 * Type สำหรับการสร้าง Customer ใหม่
 */
export type NewCustomer = typeof customers.$inferInsert
export type Customer = typeof customers.$inferSelect

/**
 * Type สำหรับการสร้าง Transaction ใหม่
 */
export type NewTransaction = typeof transactions.$inferInsert
export type Transaction = typeof transactions.$inferSelect

/**
 * Type สำหรับการสร้าง Invoice ใหม่
 */
export type NewInvoice = typeof invoices.$inferInsert
export type Invoice = typeof invoices.$inferSelect
