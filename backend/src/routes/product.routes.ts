import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';
import { validate, validateQuery, createProductSchema, updateProductSchema, paginationSchema } from '../validators';
import { uploadImage, uploadCsv } from '../middleware/upload';

const router = Router();
const productController = new ProductController();

router.use(authenticate);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List all products with pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt]
 *         default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         default: desc
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Paginated list of products
 */
router.get('/', validateQuery(paginationSchema), productController.list);

/**
 * @swagger
 * /api/products/export/csv:
 *   get:
 *     summary: Export products as CSV
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 */
router.get('/export/csv', productController.exportCsv);

/**
 * @swagger
 * /api/products/export/xlsx:
 *   get:
 *     summary: Export products as XLSX
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: XLSX file
 */
router.get('/export/xlsx', productController.exportXlsx);

/**
 * @swagger
 * /api/products/bulk-upload:
 *   post:
 *     summary: Bulk upload products via CSV
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload summary
 */
router.post('/bulk-upload', uploadCsv.single('file'), productController.bulkUpload);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', productController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', uploadImage.single('image'), validate(createProductSchema), productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put('/:id', uploadImage.single('image'), validate(updateProductSchema), productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete('/:id', productController.delete);

export default router;
