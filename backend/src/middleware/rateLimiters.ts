import rateLimit from 'express-rate-limit';

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
};

export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

export const readLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});

export const writeLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many write requests, please try again later' },
});

export const exportLimiter = rateLimit({
  ...baseOptions,
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many export requests, please try again later' },
});

export const uploadLimiter = rateLimit({
  ...baseOptions,
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many upload requests, please try again later' },
});
