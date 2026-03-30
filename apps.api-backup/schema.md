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
  examination_fields: json('examination_fields').default('[]'),
  token: varchar('token').default(''),
  profile: varchar('profile').default(''),
  deleted_at: timestamp('deleted_at')
});

export const examination_fields = pgTable('examination_field', {
  id: serial('id').primaryKey(),
  examination_name: varchar('examination_name').notNull(),
  subjects_exam: json('subjects_exam').notNull(),
  exam_time: integer('exam_time').notNull(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  pass: integer('pass').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  category: json('category').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
});

export const subject_categories = pgTable('subject_category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
});

export const examinations = pgTable('examination', {
  id: serial('id').notNull().primaryKey(),
  no: integer('no').notNull(),
  subject_id: integer('subject_id').references(() => subjects.id),
  question: varchar('question').notNull(),
  answer_options: json('answer_options').notNull(),
  correct_answer: integer('correct_answer').notNull(),
  detailed_answer: varchar('detailed_answer').notNull(),
  chapter: json('chapter').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
});

export const chapters = pgTable('chapter', {
  id: serial('id').notNull().primaryKey(),
  name: varchar('name').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  subject_id: integer('subject_id'),
  deleted_at: timestamp('deleted_at')
});

export const practices = pgTable('practice', {
  id: serial('id').notNull().primaryKey(),
  examination_id: integer('examination_id').references(() => examinations.id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  correct_answer: integer('correct_answer').notNull(),
  choose_answer: integer('choose_answer').notNull(),
  correct: integer('correct').notNull(),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  second: integer('second').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
  chapter_id: json('chapter_id').default('[]'),
  subject_id: integer('subject_id').notNull(),
});

export const bookmarks = pgTable('bookmark', {
  id: serial('id').notNull().primaryKey(),
  subject_id: integer('subject_id').notNull(),
  examination_id: json('examination_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
  user_id: uuid('user_id').notNull().references(() => users.id),
});

export const sheets = pgTable('sheet', {
  id: serial('id').notNull().primaryKey(),
  subject_id: integer('subject_id').notNull(),
  image: varchar('image').notNull(),
  page: integer('page').notNull(),
  chapter: json('chapter').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
});

export const examination_rounds = pgTable('examination_round', {
  id: serial('id').notNull().primaryKey(),
  examination_id: integer('examination_id').references(() => examinations.id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  correct_answer: integer('correct_answer').notNull(),
  choose_answer: integer('choose_answer').notNull(),
  correct: integer('correct').notNull(),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  second: integer('second').notNull(),
  subject_id: integer('subject_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
  round_id: varchar('round_id').notNull(),
  status: boolean('status').default(false)
});

export const report_roundtests = pgTable('report_roundtest', {
  id: serial('id').notNull().primaryKey(),
  round_id: varchar('round_id').notNull(),
  examinationfield_id: integer('examinationfield_id').references(() => examination_fields.id),
  user_id: uuid('user_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
  exam_score: integer('exam_score').default(0),
  score_subjects: json('score_subjects').default('[]'),
  exam_time_total: integer('exam_time_total').default(0),
  examination_name: varchar('examination_name').default(''),
  pass: integer('pass').default(60)
});

export const payment_stripe = pgTable('payment_stripe', {
  id: serial('id').notNull().primaryKey(),
  user_id: varchar('user_id').notNull().default(''),
  username: varchar('username').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  day: integer('day').notNull(),
  subjects: jsonb('subjects').notNull().default('[]'),
  sheets: jsonb('sheets').notNull().default('[]'),
  status: boolean('status').notNull(),
  activate: boolean('activate').notNull(),
  activate_code: varchar('activate_code').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  deleted_at: timestamp('deleted_at')
}); 