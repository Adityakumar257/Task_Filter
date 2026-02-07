import express from 'express';
import { getFilteredProducts } from '../ProductController/ProductController.js';
import validateFilterQuery from '../middleware/validateQuery.js';

const router = express.Router();
router.get('/', validateFilterQuery, getFilteredProducts);
router.post('/', getFilteredProducts);

export default router;