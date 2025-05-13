import { Router } from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.delete('/me', authenticate, deleteProfile);

export default router;
