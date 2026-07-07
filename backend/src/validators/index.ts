import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  price: z.coerce.number().positive('Price must be greater than 0'),
  categoryId: z.string().uuid('Invalid category ID'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255).optional(),
  price: z.coerce.number().positive('Price must be greater than 0').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        _res.status(422).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        _res.status(422).json({
          success: false,
          message: 'Query validation failed',
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
