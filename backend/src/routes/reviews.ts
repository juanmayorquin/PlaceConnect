// backend/src/routes/reviews.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createReview } from '../controllers/reviewController';

const router = Router();
router.post('/', authenticate, createReview);
export default router;
