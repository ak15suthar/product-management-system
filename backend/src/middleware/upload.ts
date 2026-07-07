import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { VALID_IMAGE_TYPES } from '../constants';
import { BadRequestError } from '../utils/errors';

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

const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

export const uploadImage = multer({
  storage: useCloudinary
    ? new CloudinaryStorage({
        cloudinary,
        params: {
          folder: 'pms/products',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          transformation: [{ width: 800, height: 800, crop: 'limit' }],
        } as any,
      })
    : multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, 'src/uploads');
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${require('path').extname(file.originalname)}`);
        },
      }),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadCsv = multer({
  storage: multer.memoryStorage(),
  fileFilter: csvFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
