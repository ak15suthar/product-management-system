import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { sendSuccess, sendPaginated } from '../utils/response';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.create(req.body);
      sendSuccess(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.getById(parseInt(String(req.params.id)));
      sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const search = req.query.search as string | undefined;
      const result = await this.categoryService.list({ page, limit, search });
      sendPaginated(res, result.categories, result.total, page, limit);
    } catch (error) {
      next(error);
    }
  };

  listAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.listAll();
      sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.update(parseInt(String(req.params.id)), req.body);
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.categoryService.delete(parseInt(String(req.params.id)));
      sendSuccess(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
