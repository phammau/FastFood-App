import Order from '../models/order.model.js';
import OrderItem from '../models/order_food.model.js';
import db from '../config/db.js';

export const createOrder = (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'Thiếu user_id' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cart rỗng' });
  }

  const foodIds = items.map(i => Number(i.food_id));

  const sqlFood = 'SELECT id, price FROM foods WHERE id IN (?)';

  db.query(sqlFood, [foodIds], (err, foods) => {
    if (err) return res.status(500).json(err);

    if (foods.length !== foodIds.length) {
      return res
        .status(400)
        .json({ message: 'Có món không tồn tại' });
    }

    let total = 0;

    items.forEach(item => {
      const food = foods.find(f => f.id === Number(item.food_id));
      total += food.price * item.quantity;
    });

    Order.createOrder(
      { user_id, total, status: 'PENDING' },
      (err, result) => {
        if (err) return res.status(500).json(err);

        const orderId = result.insertId;

        items.forEach(item => {
          const food = foods.find(f => f.id === Number(item.food_id));

          OrderItem.createOrderItem(
            {
              order_id: orderId,
              food_id: item.food_id,
              quantity: item.quantity,
              price: food.price,
            },
            err => {
              if (err) console.error('Order item lỗi:', err);
            }
          );
        });

        res.json({
          message: 'Đặt hàng thành công',
          order_id: orderId,
        });
      }
    );
  });
};

export const getOrdersByUser = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.total,
      o.status,
      o.created_at,
      oi.quantity,
      oi.price,
      f.name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN foods f ON oi.food_id = f.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);

    const ordersMap = {};
    rows.forEach(r => {
      if (!ordersMap[r.order_id]) {
        ordersMap[r.order_id] = {
          id: r.order_id,
          total: r.total,
          status: r.status,
          createdAt: r.created_at,
          items: []
        };
      }

      ordersMap[r.order_id].items.push({
        name: r.name,
        quantity: r.quantity,
        price: r.price
      });
    });

    res.json(Object.values(ordersMap));
  });
};

// huy don
export const cancelOrder = (req, res) => {
  const { orderId } = req.params;

  const sql = `
    UPDATE orders
    SET status = 'CANCELLED'
    WHERE id = ? AND status = 'PENDING'
  `;

  db.query(sql, [orderId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: 'Không thể hủy đơn này'
      });
    }

    res.json({ message: 'Đã hủy đơn thành công' });
  });
};

// Lấy tất cả đơn (ADMIN)
export const getAllOrders = (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.total,
      o.status,
      o.created_at,
      u.name AS user_name,
      oi.quantity,
      oi.price,
      f.name AS food_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN foods f ON oi.food_id = f.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);

    const ordersMap = {};

    rows.forEach(r => {
      if (!ordersMap[r.order_id]) {
        ordersMap[r.order_id] = {
          id: r.order_id,
          user: r.user_name,
          total: r.total,
          status: r.status,
          createdAt: r.created_at,
          items: []
        };
      }

      ordersMap[r.order_id].items.push({
        name: r.food_name,
        quantity: r.quantity,
        price: r.price
      });
    });

    res.json(Object.values(ordersMap));
  });
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Delete orders
export const deleteOrder = (req, res) => {
  const { orderId } = req.params;

  // Xóa order_items trước (do có foreign key)
  const deleteItemsSql = 'DELETE FROM order_items WHERE order_id = ?';

  db.query(deleteItemsSql, [orderId], (err) => {
    if (err) return res.status(500).json(err);

    // Sau đó xóa order
    const deleteOrderSql = 'DELETE FROM orders WHERE id = ?';

    db.query(deleteOrderSql, [orderId], (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Không tìm thấy đơn hàng',
        });
      }

      res.json({ message: 'Xóa đơn thành công' });
    });
  });
};


// Đếm số đơn COMPLETED
export const countCompletedOrders = (req, res) => {
  const sql = `
    SELECT COUNT(*) AS total
    FROM orders
    WHERE status = 'COMPLETED'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ total: result[0].total });
  });
};

// Tính tổng doanh thu đơn COMPLETED
export const getTotalRevenue = (req, res) => {
  db.query(
    "SELECT SUM(total) AS totalRevenue FROM orders WHERE status = 'COMPLETED'",
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.json({
        total: results[0].totalRevenue || 0
      });
    }
  );
};

// Lấy đơn COMPLETED của user
export const getCompletedOrdersByUser = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.total,
      o.status,
      o.created_at,
      oi.quantity,
      oi.price,
      f.name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN foods f ON oi.food_id = f.id
    WHERE o.user_id = ?
    AND o.status = 'COMPLETED'
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);

    const ordersMap = {};
    rows.forEach(r => {
      if (!ordersMap[r.order_id]) {
        ordersMap[r.order_id] = {
          id: r.order_id,
          total: r.total,
          status: r.status,
          createdAt: r.created_at,
          items: []
        };
      }

      ordersMap[r.order_id].items.push({
        name: r.name,
        quantity: r.quantity,
        price: r.price
      });
    });

    res.json(Object.values(ordersMap));
  });
};


