import { Request, Response, NextFunction } from 'express';

function stripHtml(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }
  if (Array.isArray(value)) return value.map(stripHtml);
  if (value && typeof value === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      cleaned[key] = stripHtml(val);
    }
    return cleaned;
  }
  return value;
}

export const sanitize = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) req.body = stripHtml(req.body);
  if (req.query) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(req.query)) {
      cleaned[key] = stripHtml(val);
    }
    req.query = cleaned as any;
  }
  next();
};
