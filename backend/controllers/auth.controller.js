import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.utils.js';

// @returns {String} — nomdan unique username yaratish
const generateUsername = async (name) => {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 18) || 'user';

  let username = base;
  let counter = 1;
  while (await User.findOne({ username })) {
    username = `${base}${counter++}`;
  }
  return username;
};

// @returns {Object} — ro'yxatdan o'tish
const register = async (req, res) => {
  try {
    const { name, email, password, username: rawUsername } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Bu email allaqachon ro\'yxatdan o\'tgan' });

    let username = rawUsername
      ? rawUsername.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20)
      : await generateUsername(name);

    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username kamida 3 belgi bo\'lishi kerak' });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) return res.status(400).json({ message: 'Bu username band. Boshqasini tanlang' });

    const user = await User.create({ name, email, password, username });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
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
      user: {
        _id: user._id, name: user.name, username: user.username,
        email: user.email, role: user.role, isPaid: user.isPaid,
        level: user.level, totalScore: user.totalScore,
        completedVideos: user.completedVideos,
        completedQuizzes: user.completedQuizzes,
        completedSections: user.completedSections
      }
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

// @returns {Object} — username band emasligini tekshirish
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.length < 3) return res.status(400).json({ message: 'Kamida 3 belgi' });
    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Bu username band' });
    res.json({ available: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { register, login, getMe, changePassword, checkUsername };
