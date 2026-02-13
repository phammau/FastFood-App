import express from 'express';
import { getCustomers, deleteCustomer } from '../controllers/admin.controller.js';

const router = express.Router();

// lấy danh sách khách hàng
router.get('/customers', getCustomers);

// xoá khách hàng
router.delete('/customers/:id', deleteCustomer);

export default router;
