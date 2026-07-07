import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/response';

export class DashboardController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.productService.getDashboard();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  };
}
