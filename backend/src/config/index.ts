import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  uploadDir: process.env.UPLOAD_DIR || 'src/uploads',
  exportDir: process.env.EXPORT_DIR || 'src/exports',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};

export function getCorsOrigins(): string[] | string {
  const origins = config.corsOrigin.split(',').map((o) => o.trim());
  if (origins.length === 1) return origins[0];
  return origins;
}
