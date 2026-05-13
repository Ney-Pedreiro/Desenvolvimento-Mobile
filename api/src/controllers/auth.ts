import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { LoginRequest, RegisterRequest } from '../types/index.js';
import { AuthService } from '../services/auth.js';
import { ApiError } from '../utils/errors.js';

const authService = new AuthService();

export class AuthController {
  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      if (!email || !password) {
        throw new ApiError(400, 'INVALID_INPUT', 'Email and password are required');
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body as RegisterRequest;

      if (!email || !password || !name) {
        throw new ApiError(
          400,
          'INVALID_INPUT',
          'Email, password, and name are required'
        );
      }

      const result = await authService.register(email, password, name);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async verify(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
