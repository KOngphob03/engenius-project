import { AuthUseCase } from '../../../core/use-cases/index.js';
import { getErrorMessage } from '../../../shared/utils/error-handler.js';

/**
 * Auth Controller
 * HTTP layer - handles email + password authentication requests
 * OTP methods are kept for future use but not exposed in routes
 */
export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  /**
   * POST /auth/login
   * Login with email and password
   */
  async login(email: string, password: string) {
    try {
      const result = await this.authUseCase.login(email, password);
      return { data: result, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 401 };
    }
  }

  /**
   * POST /auth/request-otp (KEPT FOR FUTURE USE - NOT EXPOSED IN ROUTES)
   * Request OTP for login
   */
  async requestOTP(email: string) {
    try {
      const result = await this.authUseCase.requestOTP(email);
      return { data: result, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * POST /auth/login-otp (KEPT FOR FUTURE USE - NOT EXPOSED IN ROUTES)
   * Login with email and OTP
   */
  async loginWithOTP(email: string, otp: string) {
    try {
      const result = await this.authUseCase.loginWithOTP(email, otp);
      return { data: result, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 401 };
    }
  }

  /**
   * POST /auth/logout
   */
  async logout(userId: string) {
    try {
      await this.authUseCase.logout(userId);
      return { message: 'Logged out successfully', status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 400 };
    }
  }

  /**
   * GET /auth/verify
   */
  async verifyToken(token: string) {
    try {
      const user = await this.authUseCase.verifyToken(token);
      if (!user) {
        return { error: 'Invalid token', status: 401 };
      }
      return { data: user, status: 200 };
    } catch (error: unknown) {
      return { error: getErrorMessage(error), status: 401 };
    }
  }
}
