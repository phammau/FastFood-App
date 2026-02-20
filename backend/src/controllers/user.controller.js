import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export const getUsers = (req, res) => {
  UserModel.getAll((err, results) => {
    if (err) {
      console.error('GET USERS ERROR:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
};

export const countUsers = (req, res) => {
  UserModel.count((err, results) => {
    if (err) {
      console.error('COUNT USERS ERROR:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ total: results[0].total });
  });
};


// thay doi pass
export const changePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // 1. Lấy user
    db.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
      async (err, results) => {
        if (err) return res.status(500).json(err);

        const user = results[0];
        if (!user) {
          return res.status(404).json({ message: 'User không tồn tại' });
        }

        // 2. So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(
          oldPassword,
          user.password
        );

        if (!isMatch) {
          return res
            .status(400)
            .json({ message: 'Mật khẩu cũ không đúng' });
        }

        // 3. Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update DB
        db.query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, id],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({
              message: 'Đổi mật khẩu thành công',
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
