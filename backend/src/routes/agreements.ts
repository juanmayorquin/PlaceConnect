// backend/src/routes/agreements.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import {
  createAgreement,
  updateAgreement,
  cancelAgreement,
  requestAgreement,
  acceptAgreement,
  rejectAgreement
} from '../controllers/agreementController';

const router = Router();

// Endpoints originales (crear directo, modificar, cancelar)
router.post('/', authenticate, createAgreement);
router.put('/:id', authenticate, updateAgreement);
router.post('/:id/cancel', authenticate, cancelAgreement);

// Nuevos endpoints
router.post('/request', authenticate, requestAgreement);
router.post('/:id/accept', authenticate, acceptAgreement);
router.post('/:id/reject', authenticate, rejectAgreement);


export default router;
