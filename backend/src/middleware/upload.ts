import multer from 'multer';
import path from 'path';
import { config } from '../config';
import { VALID_IMAGE_TYPES } from '../constants';
import { BadRequestError } from '../utils/errors';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (VALID_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only JPEG, PNG, GIF, and WEBP images are allowed'));
  }
};

const csvFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only CSV files are allowed'));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: config.maxFileSize },
});

export const uploadCsv = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, config.uploadDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `bulk-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: csvFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
