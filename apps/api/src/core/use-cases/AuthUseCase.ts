import { UserRepository } from '../ports';
import { User } from '../domain/entities';

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password: string): string {
  // In production, use bcrypt!
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password: string, storedPassword: string): boolean {
  // Support both plaintext and base64 hashed passwords
  // Check if stored password looks like base64 (no spaces, special chars only)
  const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(storedPassword) && storedPassword.length > 10;

  if (isBase64) {
    // Stored password is hashed - verify with hash
    return hashPassword(password) === storedPassword;
  } else {
    // Stored password is plaintext - direct comparison
    return password === storedPassword;
  }
}

/**
 * Auth Use Case
 * Contains authentication business logic using email + password
 * OTP functions are kept for future use but not currently used
 */
export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is deleted
    if (user.isDeleted()) {
      throw new Error('Account has been deleted');
    }

    // Verify password
    if (!user.password || !verifyPassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }

    // Check if membership is expired (optional, based on requirements)
    if (user.isMembershipExpired()) {
      // You might want to allow login even if membership expired
      // Comment this out if not needed
      // throw new Error('Membership expired');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Update user token
    await this.userRepository.update(user.id, {
      token,
      activated: true,
    });

    return {
      user,
      token,
    };
  }

  /**
   * Request OTP for login (KEPT FOR FUTURE USE - NOT CURRENTLY USED)
   * Generates and sends OTP to user's email
   */
  async requestOTP(email: string): Promise<{ message: string; otp?: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is deleted
    if (user.isDeleted()) {
      throw new Error('Account has been deleted');
    }

    // Generate OTP (6 digits)
    const otp = this.generateOTP();
    const expOtp = new Date();
    expOtp.setMinutes(expOtp.getMinutes() + 15); // OTP expires in 15 minutes

    // Update user with new OTP
    await this.userRepository.updateOtp(user.id, otp, expOtp);

    // TODO: Send OTP via email (Nodemailer, SendGrid, etc.)
    // For now, return OTP in response (for testing only)
    console.log(`OTP for ${email}: ${otp}`);

    return {
      message: 'OTP sent to your email',
      otp: otp, // In production, DON'T return OTP
    };
  }

  /**
   * Login with email and OTP (KEPT FOR FUTURE USE - NOT CURRENTLY USED)
   */
  async loginWithOTP(email: string, otp: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is deleted
    if (user.isDeleted()) {
      throw new Error('Account has been deleted');
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Check if OTP is expired
    if (!user.isOtpValid()) {
      throw new Error('OTP expired. Please request a new OTP.');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Update user token and clear OTP
    await this.userRepository.update(user.id, {
      token,
      otp: null,
      expOtp: null,
      activated: true,
    });

    return {
      user,
      token,
    };
  }

  /**
   * Verify token and get user
   */
  async verifyToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findByToken(token);

    if (!user || user.isDeleted()) {
      return null;
    }

    return user;
  }

  /**
   * Logout user
   */
  async logout(userId: string): Promise<void> {
    // Clear user token
    await this.userRepository.update(userId, { token: null });
  }

  /**
   * Generate 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate simple token (In production, use JWT)
   */
  private generateToken(userId: string): string {
    const timestamp = Date.now();
    return Buffer.from(`${userId}:${timestamp}`).toString('base64');
  }
}
