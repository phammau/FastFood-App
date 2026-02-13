import db from '../config/db.js';

// Tạo order
const createOrder = (orderData, callback) => {
  const sql = `
    INSERT INTO orders (user_id, total, status)
    VALUES (?, ?, ?)
  `;
  db.query(
    sql,
    [
      orderData.user_id,
      orderData.total,
      orderData.status || 'PENDING',
    ],
    callback
  );
};

// Lấy order theo user
const getOrdersByUser = (userId, callback) => {
  const sql = `
    SELECT * FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  db.query(sql, [userId], callback);
};

export default {
  createOrder,
  getOrdersByUser,
};
