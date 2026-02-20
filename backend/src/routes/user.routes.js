import express from 'express';
import { getUsers, countUsers, changePassword } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/count', countUsers);   
router.get('/', getUsers);
router.put('/change-password', changePassword);

export default router;
