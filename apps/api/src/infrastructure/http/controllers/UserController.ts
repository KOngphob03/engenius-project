import { UserUseCase } from '../../../core/use-cases/index.js';
import { User, UserRole, Subject, ExaminationFields } from '../../../core/domain/entities/User.entity.js';
import { getErrorMessage } from '../../../shared/utils/error-handler.js';

interface UserRequestData {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  university: string | null;
  department: string | null;
  exp: Date | null;
  expKorpor: Date | null;
  expOtp: Date | null;
  subject: Subject | null;
  role: UserRole[];
  time: number;
  activated: boolean;
  otp: string | null;
  examinationFields: ExaminationFields | null;
  token: string | null;
  profile: string | null;
  deletedAt: Date | null;
}

type CreateUserRequest = Partial<UserRequestData>;
type UpdateUserRequest = Partial<UserRequestData>;

/**
 * User Controller
 * HTTP layer - delegates to use cases
 */
export class UserController {
  constructor(private readonly userUseCase: UserUseCase) {}

  /**
   * GET /users/:id
   */
  async getUser(id: string) {
    const user = await this.userUseCase.getUserById(id);
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
    return { data: user, status: 200 };
  }

  /**
   * GET /users/email/:email
   */
  async getUserByEmail(email: string) {
    const user = await this.userUseCase.getUserByEmail(email);
    if (!user) {
      return { error: 'User not found', status: 404 };
    }
    return { data: user, status: 200 };
  }

  /**
   * POST /users
   */
  async createUser(data: CreateUserRequest) {
    try {
      const user = await this.userUseCase.createUser(data);
      return { data: user, status: 201 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * PUT /users/:id
   */
  async updateUser(id: string, data: UpdateUserRequest) {
    try {
      const user = await this.userUseCase.updateUser(id, data);
      return { data: user, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * DELETE /users/:id
   */
  async deleteUser(id: string) {
    try {
      await this.userUseCase.deleteUser(id);
      return { message: 'User deleted successfully', status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * GET /users
   */
  async getAllUsers(limit = 100, offset = 0) {
    const users = await this.userUseCase.getAllUsers(limit, offset);
    return { data: users, status: 200 };
  }

  /**
   * POST /users/verify-otp
   */
  async verifyOtp(otp: string) {
    try {
      const user = await this.userUseCase.verifyOtp(otp);
      if (!user) {
        return { error: 'Invalid OTP', status: 400 };
      }
      return { data: user, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * GET /users/:id/membership
   */
  async checkMembership(id: string) {
    try {
      const status = await this.userUseCase.checkMembershipStatus(id);
      return { data: status, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }
}
