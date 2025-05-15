// backend/src/routes/users.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.delete('/me', authenticate, deleteProfile);

export default router;
