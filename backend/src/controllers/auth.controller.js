import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../models/user.model.js';

//dang ky
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate
    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    // 2. Check email tồn tại
    const existUser = await findUserByEmail(email);
    if (existUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Lưu database
    await createUser(name, email, hashedPassword, role || 'USER');

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu' });
    }

    //phan biet user và admin
    const isAdmin = user.role === 'ADMIN';
    res.json({
      message: isAdmin
        ? 'Đăng nhập ADMIN thành công'
        : 'Đăng nhập USER thành công',
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
