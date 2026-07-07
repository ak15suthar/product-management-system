import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendPaginated } from '../utils/response';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.create(req.body);
      sendSuccess(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getById(parseInt(String(req.params.id)));
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const search = req.query.search as string | undefined;
      const result = await this.userService.list({ page, limit, search });
      sendPaginated(res, result.users, result.total, page, limit);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.update(parseInt(String(req.params.id)), req.body);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.delete(parseInt(String(req.params.id)));
      sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
