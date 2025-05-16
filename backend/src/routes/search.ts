import { Router } from 'express';
import { searchProperties, getProperty } from '../controllers/searchController';
const router = Router();
router.get('/', searchProperties);
router.get('/:id', getProperty);
export default router;