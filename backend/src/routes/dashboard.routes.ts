import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';
import { readLimiter } from '../middleware/rateLimiters';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticate);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/', readLimiter, dashboardController.getStats);

export default router;
