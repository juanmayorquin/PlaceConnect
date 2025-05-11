import { Router } from 'express';
import { register, verifyEmail, login, requestPasswordReset, resetPassword } from '../controllers/authController';
import { hashPassword } from '../middlewares/hashPassword';

const router = Router();

router.post('/register', hashPassword, register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/reset/:token', resetPassword);

export default router;
