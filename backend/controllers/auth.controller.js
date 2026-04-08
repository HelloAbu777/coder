import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.utils.js';

// @returns {Object} — ro'yxatdan o'tish
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Bu email allaqachon ro\'yxatdan o\'tgan' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email yoki parol noto\'g\'ri' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Email yoki parol noto\'g\'ri' });

    if (user.isBlocked) return res.status(403).json({ message: 'Hisobingiz bloklangan' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, isPaid: user.isPaid, level: user.level }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — joriy foydalanuvchi ma'lumotlari
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — parol o'zgartirish
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: 'Eski parol noto\'g\'ri' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Parol muvaffaqiyatli o\'zgartirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { register, login, getMe, changePassword };
