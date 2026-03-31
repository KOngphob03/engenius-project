import { UserRepository } from '../ports/index.js';
import { User } from '../domain/entities/index.js';

/**
 * User Use Case
 * Contains application business logic for user operations
 */
export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  /**
   * Create new user
   */
  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Business logic: Validate email uniqueness is handled by repository
    // Business logic: Set default role if not provided
    const userToCreate = {
      ...data,
      role: data.role || ['user'],
      time: data.time || 0,
      activated: data.activated || false,
    };

    return await this.userRepository.create(userToCreate);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return await this.userRepository.update(id, data);
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(id);
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(limit = 100, offset = 0): Promise<User[]> {
    return await this.userRepository.findAll(limit, offset);
  }

  /**
   * Verify OTP
   */
  async verifyOtp(otp: string): Promise<User | null> {
    const user = await this.userRepository.findByOtp(otp);
    if (!user) {
      return null;
    }

    // Business logic: Check if OTP is expired
    if (!user.isOtpValid()) {
      throw new Error('OTP expired');
    }

    // Business logic: Activate user after successful OTP verification
    return await this.userRepository.activateUser(user.id);
  }

  /**
   * Check user membership status
   */
  async checkMembershipStatus(id: string): Promise<{ isValid: boolean; expiryDate: Date | null }> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      isValid: !user.isMembershipExpired(),
      expiryDate: user.exp,
    };
  }
}
