import express from 'express';
import {
    createOrder,
    getOrdersByUser,
    getCompletedOrdersByUser,
    cancelOrder,
    getAllOrders,
    deleteOrder,
    updateOrderStatus,
    countCompletedOrders,
    getTotalRevenue
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.put('/cancel/:orderId', cancelOrder);

router.get('/', getAllOrders);
router.delete('/:orderId', deleteOrder);
router.put('/status/:orderId', updateOrderStatus);
router.get('/count/completed', countCompletedOrders);
router.get('/revenue', getTotalRevenue);
router.get('/user/:userId/completed', getCompletedOrdersByUser);

export default router;
