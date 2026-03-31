/**
 * User Domain Entity
 * Pure business logic - NO external dependencies
 */

export type UserRole = 'user' | 'admin';

export interface Subject {
  id: string;
  name: string;
  sheets: string[];
}

export interface ExaminationFields {
  [key: string]: string | number | boolean | null | undefined;
}

export class User {
  constructor(
    public readonly id: string,
    public firstname: string | null,
    public lastname: string | null,
    public email: string | null,
    public password: string | null,
    public phone: string | null,
    public university: string | null,
    public department: string | null,
    public exp: Date | null,
    public expKorpor: Date | null,
    public expOtp: Date | null,
    public subject: Subject | null,
    public role: UserRole[],
    public createdAt: Date,
    public updatedAt: Date,
    public time: number,
    public activated: boolean,
    public otp: string | null,
    public examinationFields: ExaminationFields | null,
    public token: string | null,
    public profile: string | null,
    public deletedAt: Date | null,
  ) {}

  /**
   * Business logic: Check if user has admin role
   */
  isAdmin(): boolean {
    return this.role.includes('admin');
  }

  /**
   * Business logic: Check if user membership is expired
   */
  isMembershipExpired(): boolean {
    if (!this.exp) return true;
    return this.exp < new Date();
  }

  /**
   * Business logic: Check if OTP is valid (kept for future use)
   */
  isOtpValid(): boolean {
    if (!this.expOtp) return false;
    return this.expOtp > new Date();
  }

  /**
   * Business logic: Get remaining time in minutes
   */
  getRemainingTimeInMinutes(): number {
    return Math.floor(this.time / 60);
  }

  /**
   * Business logic: Check if account is deleted
   */
  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
