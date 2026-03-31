import { eq, isNull, desc } from 'drizzle-orm';
import { db } from '../../../shared/config/database.js';
import { users, type User as UserModel } from '../drizzle/schema/index.js';
import { User, UserRepository as IUserRepository } from '../../../core/index.js';
import { UserRole, Subject } from '../../../core/domain/entities/User.entity.js';

/**
 * User Repository Implementation
 * Implements UserRepository port using Drizzle ORM
 */
export class UserRepository implements IUserRepository {
  /**
   * Map database model to domain entity
   */
  private toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.firstname,
      model.lastname,
      model.email,
      model.password,
      model.phone,
      model.university,
      model.department,
      model.exp,
      model.expKorpor,
      model.expOtp,
      model.subject,
      (model.role as UserRole[]) || (['user'] as UserRole[]),
      model.createdAt!,
      model.updatedAt!,
      model.time || 0,
      model.activated || false,
      model.otp,
      model.examinationFields,
      model.token,
      model.profile,
      model.deletedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result[0] ? this.toDomain(result[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result[0] ? this.toDomain(result[0]) : null;
  }

  async findByToken(token: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.token, token))
      .limit(1);

    return result[0] ? this.toDomain(result[0]) : null;
  }

  async findByOtp(otp: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.otp, otp))
      .limit(1);

    return result[0] ? this.toDomain(result[0]) : null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        phone: user.phone,
        university: user.university,
        department: user.department,
        exp: user.exp ? new Date(user.exp) : null,
        expKorpor: user.expKorpor ? new Date(user.expKorpor) : null,
        expOtp: user.expOtp ? new Date(user.expOtp) : null,
        subject: user.subject,
        role: user.role,
        time: user.time,
        activated: user.activated,
        otp: user.otp,
        examinationFields: user.examinationFields,
        token: user.token,
        profile: user.profile,
        deletedAt: user.deletedAt ? new Date(user.deletedAt) : null,
      })
      .returning();

    return this.toDomain(newUser);
  }

  async update(id: string, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {};
    
    if (user.firstname !== undefined) updateData.firstname = user.firstname;
    if (user.lastname !== undefined) updateData.lastname = user.lastname;
    if (user.email !== undefined) updateData.email = user.email;
    if (user.password !== undefined) updateData.password = user.password;
    if (user.phone !== undefined) updateData.phone = user.phone;
    if (user.university !== undefined) updateData.university = user.university;
    if (user.department !== undefined) updateData.department = user.department;
    if (user.exp !== undefined) updateData.exp = user.exp ? new Date(user.exp) : null;
    if (user.expKorpor !== undefined) updateData.expKorpor = user.expKorpor ? new Date(user.expKorpor) : null;
    if (user.expOtp !== undefined) updateData.expOtp = user.expOtp ? new Date(user.expOtp) : null;
    if (user.subject !== undefined) updateData.subject = user.subject;
    if (user.role !== undefined) updateData.role = user.role;
    if (user.time !== undefined) updateData.time = user.time;
    if (user.activated !== undefined) updateData.activated = user.activated;
    if (user.otp !== undefined) updateData.otp = user.otp;
    if (user.examinationFields !== undefined) updateData.examinationFields = user.examinationFields;
    if (user.token !== undefined) updateData.token = user.token;
    if (user.profile !== undefined) updateData.profile = user.profile;
    if (user.deletedAt !== undefined) updateData.deletedAt = user.deletedAt ? new Date(user.deletedAt) : null;

    const [updatedUser] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return this.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id));
  }

  async findAll(limit = 100, offset = 0): Promise<User[]> {
    const result = await db
      .select()
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return result.map(model => this.toDomain(model));
  }

  async updateTime(id: string, time: number): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ time, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return this.toDomain(updatedUser);
  }

  async activateUser(id: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ activated: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return this.toDomain(updatedUser);
  }

  async updateOtp(id: string, otp: string, expOtp: Date): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ otp, expOtp, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return this.toDomain(updatedUser);
  }
}
