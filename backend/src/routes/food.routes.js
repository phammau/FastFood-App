import express from 'express';
import { upload } from '../middlewares/upload.js';

import {
  getFoods,
  getFoodById,
  addFood,
  updateFood,
  deleteFood,
  countFoods,
} from '../controllers/food.controller.js';

const router = express.Router();

// USER
router.get('/count', countFoods);
router.get('/', getFoods);
router.get('/:id', getFoodById);

// ADMIN
router.put('/:id', upload.single('image'), updateFood);
router.delete('/:id', deleteFood);
router.post('/', upload.single('image'), addFood);

export default router;
