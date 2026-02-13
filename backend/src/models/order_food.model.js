import db from '../config/db.js';

// Tạo order_item
const createOrderItem = (item, callback) => {
  const sql = `
    INSERT INTO order_items
    (order_id, food_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      item.order_id,
      item.food_id,
      item.quantity,
      item.price,
    ],
    callback
  );
};

// Lấy món trong đơn
const getItemsByOrder = (orderId, callback) => {
  const sql = `
    SELECT oi.*, f.name, f.image
    FROM order_items oi
    JOIN foods f ON oi.food_id = f.id
    WHERE oi.order_id = ?
  `;
  db.query(sql, [orderId], callback);
};

export default {
  createOrderItem,
  getItemsByOrder,
};
