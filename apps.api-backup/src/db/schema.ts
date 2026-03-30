import { pgTable, uuid, varchar, timestamp, json, integer, boolean, decimal, jsonb, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstname: varchar('firstname', { length: 255 }).notNull(),
  lastname: varchar('lastname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone').notNull(),
  university: varchar('university').notNull(),
  department: varchar('department').notNull(),
  exp: timestamp('exp').defaultNow(),
  exp_korpor: timestamp('exp_korpor').defaultNow(),
  exp_otp: timestamp('exp_otp').defaultNow(),
  subject: json('subject').default({"subjects": [], "sheets": []}),
  role: json('role').default(["user"]),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  time: integer('time').default(1800),
  activated: boolean('activated').default(false),
  otp: varchar('otp').default(''),
  examination_fields: json('examination_fields').default([]),
  token: varchar('token').default(''),
  profile: varchar('profile').default(''),
  deleted_at: timestamp('deleted_at')
});

export const payment_stripe = pgTable('payment_stripe', {
  id: serial('id').notNull().primaryKey(),
  user_id: varchar('user_id').notNull().default(''),
  username: varchar('username').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  day: integer('day').notNull(),
  subjects: jsonb('subjects').notNull().default([]),
  sheets: jsonb('sheets').notNull().default([]),
  status: boolean('status').notNull(),
  activate: boolean('activate').notNull(),
  activate_code: varchar('activate_code').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
}); 