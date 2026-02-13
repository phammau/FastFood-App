import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default db;          // quan trong

export const connectDB = () => {
  db.connect(err => {
    if (err) {
      console.error('DB connect error:', err);
      return;
    }
    console.log('MySQL connected');

    // Tạo database
    db.query(`CREATE DATABASE IF NOT EXISTS food_app`, err => {
      if (err) throw err;
      console.log('Database ready');

      db.changeUser({ database: 'food_app' }, err => {
        if (err) throw err;

        createTables();
      });
    });
  });
};

const createTables = () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      role ENUM('USER','ADMIN') DEFAULT 'USER'
    )
  `;

  const foodsTable = `
    CREATE TABLE IF NOT EXISTS foods (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      price INT,
      description TEXT,
      image VARCHAR(255)
    )
  `;

  const ordersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total INT,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  const orderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      food_id INT,
      quantity INT,
      price INT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (food_id) REFERENCES foods(id)
    )
  `;

  db.query(usersTable);
  db.query(foodsTable);
  db.query(ordersTable);
  db.query(orderItemsTable);

  console.log('All tables ready');

  // GỌI SAU KHI TẠO BẢNG
  createAdminIfNotExists();
};

const createAdminIfNotExists = async () => {
  const email = 'admin@gmail.com';
  const password = '123456';

  db.query(
    'SELECT * FROM users WHERE role="ADMIN"',
    async (err, results) => {
      if (results.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin', email, hashedPassword, 'ADMIN'],
          () => {
            console.log('Admin account created');
            console.log('email: admin@gmail.com');
            console.log('password: 123456');
          }
        );
      } else {
        console.log('Admin already exists');
      }
    }
  );
};