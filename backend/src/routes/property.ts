import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  createProperty,
  listMyProperties,
  updateProperty,
  deleteProperty,
  listPending,
  moderateProperty,
} from '../controllers/propertyController';

const router = Router();

// Ahora sin uploadImages, solo JSON
router.post('/', authenticate, createProperty);
router.get('/me', authenticate, listMyProperties);
router.put('/:id', authenticate, updateProperty);
router.delete('/:id', authenticate, deleteProperty);

// Moderación
router.get('/pending', authenticate, listPending);
router.post('/:id/moderate', authenticate, moderateProperty);

export default router;