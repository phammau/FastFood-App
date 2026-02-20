import { db } from '../config/db.js';

export const FoodModel = {
  getAll: (cb) => {
    db.query('SELECT * FROM foods', cb);
  },

  getById: (id, cb) => {
    db.query('SELECT * FROM foods WHERE id = ?', [id], cb);
  },

  create: (data, cb) => {
    const { name, price, description, image } = data;
    db.query(
      'INSERT INTO foods (name, price, description, image) VALUES (?, ?, ?, ?)',
      [name, price, description, image],
      cb
    );
  },

  update: (id, data, cb) => {
    const { name, price, description, image } = data;
    db.query(
      'UPDATE foods SET name=?, price=?, description=?, image=? WHERE id=?',
      [name, price, description, image, id],
      cb
    );
  },

  delete: (id, cb) => {
    db.query('DELETE FROM foods WHERE id=?', [id], cb);
  },

  count: (callback) => {
    db.query('SELECT COUNT(*) AS total FROM foods', callback);
  },
};

