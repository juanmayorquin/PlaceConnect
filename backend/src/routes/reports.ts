import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth';
import { createReport, listReports, reviewReport } from '../controllers/reportController';
const router = Router();
router.post('/', authenticate, createReport);
router.get('/', authenticate, authorizeAdmin, listReports);
router.post('/:id/action', authenticate, authorizeAdmin, reviewReport);
export default router;