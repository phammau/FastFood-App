import express from 'express';
import cors from 'cors';
import { connectDB } from './src/config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// routes
import foodRoutes from './src/routes/food.routes.js';
import authRoutes from './src/routes/auth.route.js';
import orderRoutes from './src/routes/order.routes.js';
import adminRoutes from './src/routes/admin.route.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//CONNECT DATABASE
connectDB();
dotenv.config();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//ROUTES
app.use('/api/auth', authRoutes);   // LOGIN (ADMIN + USER)
app.use('/api/admin', adminRoutes);
app.use('/api/foods', foodRoutes);  // FOOD
app.use('/api/orders', orderRoutes);// ORDER (nếu có)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//TEST API
app.get('/', (req, res) => {
  res.send(' Food App API is running');
});

//START SERVER
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
