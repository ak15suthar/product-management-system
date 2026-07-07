import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      sendSuccess(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    sendSuccess(res, null, 'Logged out successfully');
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.getProfile(req.user!.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };
}
