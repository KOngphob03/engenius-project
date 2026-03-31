import { User } from '../../domain/entities';

/**
 * User Repository Port (Interface)
 * Defines the contract for user data access
 * Implementations are in Infrastructure layer
 */
export interface UserRepository {
  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by token
   */
  findByToken(token: string): Promise<User | null>;

  /**
   * Find user by OTP
   */
  findByOtp(otp: string): Promise<User | null>;

  /**
   * Create new user
   */
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

  /**
   * Update user
   */
  update(id: string, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>;

  /**
   * Soft delete user
   */
  delete(id: string): Promise<void>;

  /**
   * Find all users (with pagination)
   */
  findAll(limit?: number, offset?: number): Promise<User[]>;

  /**
   * Update user's time
   */
  updateTime(id: string, time: number): Promise<User>;

  /**
   * Activate user account
   */
  activateUser(id: string): Promise<User>;

  /**
   * Update OTP
   */
  updateOtp(id: string, otp: string, expOtp: Date): Promise<User>;
}
