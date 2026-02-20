import db from '../config/db.js';

export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

//tao user
export const createUser = (name, email, password, role) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

//lay thong tin
export const getAllCustomers = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, email FROM users WHERE role = 'USER'",
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

// delete
export const deleteCustomerById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM users WHERE id = ? AND role = 'USER'",
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

export const UserModel = {
  getAll: (cb) => {
    db.query('SELECT * FROM users', cb);
  },
  count: (cb) => {
    db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'USER'",
      cb
    );
  }
};
