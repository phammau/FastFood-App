import Order from '../models/order.model.js';
import OrderItem from '../models/order_food.model.js';
import db from '../config/db.js';


// Tạo đơn hàng
// export const createOrder = (req, res) => {
//   const { user_id, items } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ message: 'Thiếu user_id' });
//   }

//   if (!items || items.length === 0) {
//     return res.status(400).json({ message: 'Cart rỗng' });
//   }

//   const foodIds = items.map(i => i.food_id);

//   const sqlFood = 'SELECT id, price FROM foods WHERE id IN (?)';

//   db.query(sqlFood, [foodIds], (err, foods) => {
//     if (err) return res.status(500).json(err);

//     let total = 0;

//     items.forEach(item => {
//       const food = foods.find(f => f.id === item.food_id);
//       if (!food) {
//         return res.status(400).json({ message: 'Food không tồn tại' });
//       }
//       total += food.price * item.quantity;
//     });

//     Order.createOrder(
//       { user_id, total, status: 'PENDING' },
//       (err, result) => {
//         if (err) return res.status(500).json(err);

//         const orderId = result.insertId;

//         items.forEach(item => {
//           const food = foods.find(f => f.id === item.food_id);

//           OrderItem.createOrderItem(
//             {
//               order_id: orderId,
//               food_id: item.food_id,
//               quantity: item.quantity,
//               price: food.price,
//             },
//             err => {
//               if (err) console.error(err);
//             }
//           );
//         });

//         res.json({ message: 'Đặt hàng thành công', order_id: orderId });
//       }
//     );
//   });
// };
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

    // ❗ Nếu không lấy đủ food → lỗi
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
