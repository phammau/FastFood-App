import express from 'express';
//import orderController from '../controllers/order.controller.js';
import { createOrder, getOrdersByUser } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);

export default router;
