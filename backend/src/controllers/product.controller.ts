import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess, sendPaginated } from '../utils/response';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const imageData = req.file ? `/uploads/${req.file.filename}` : undefined;
      const product = await this.productService.create({
        ...req.body,
        image: imageData,
      });
      sendSuccess(res, product, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.getById(parseInt(String(req.params.id)));
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(String(req.query.page || '1'), 10);
      const limit = parseInt(String(req.query.limit || '10'), 10);
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const search = req.query.search as string | undefined;
      const categoryId = req.query.categoryId as string | undefined;
      const result = await this.productService.list({ page, limit, sortBy, sortOrder, search, categoryId });
      sendPaginated(res, result.products, result.total, page, limit);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const imageData = req.file ? `/uploads/${req.file.filename}` : undefined;
      const product = await this.productService.update(parseInt(String(req.params.id)), {
        ...req.body,
        ...(imageData && { image: imageData }),
      });
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.productService.delete(parseInt(String(req.params.id)));
      sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  bulkUpload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        sendSuccess(res, null, 'No file uploaded', 400);
        return;
      }

      const result = await this.productService.bulkUpload(req.file.path);
      sendSuccess(res, result, 'Bulk upload completed');
    } catch (error) {
      next(error);
    }
  };

  exportCsv = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stream = await this.productService.exportCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  };

  exportXlsx = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const buffer = await this.productService.exportXlsx();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  };
}
