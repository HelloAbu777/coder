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

    // Admin login (environment variable dan)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@coders.uz';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2025!Secure';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Database da admin bormi tekshirish
      let admin = await User.findOne({ email: ADMIN_EMAIL });

      // Agar yo'q bo'lsa, yaratish
      if (!admin) {
        admin = await User.create({
          name: 'Admin',
          username: 'admin_coders',
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          role: 'admin',
          isPaid: true,
          isEmailVerified: true
        });
      }

      // Agar mavjud bo'lsa, lekin admin emas bo'lsa, rolni o'zgartirish
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        admin.isPaid = true;
        await admin.save();
      }

      const token = generateToken(admin._id);

      return res.json({
        token,
        user: {
          _id: admin._id,
          name: admin.name,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          isPaid: admin.isPaid,
          level: admin.level,
          totalScore: admin.totalScore,
          completedVideos: admin.completedVideos,
          completedQuizzes: admin.completedQuizzes,
          completedSections: admin.completedSections
        }
      });
    }

    // Oddiy foydalanuvchi login
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
    
    // Validatsiya
    if (!username) {
      return res.status(400).json({ available: false, message: 'Username kiritilmagan' });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ available: false, message: 'Kamida 3 belgi bo\'lishi kerak' });
    }
    
    if (username.length > 20) {
      return res.status(400).json({ available: false, message: 'Maksimal 20 belgi' });
    }
    
    // Faqat harf, raqam va _ ruxsat etilgan
    const validPattern = /^[a-z0-9_]+$/;
    if (!validPattern.test(username)) {
      return res.status(400).json({ available: false, message: 'Faqat kichik harf, raqam va _ ishlatish mumkin' });
    }
    
    // Database da tekshirish
    const exists = await User.findOne({ username: username.toLowerCase() });
    
    if (exists) {
      return res.status(200).json({ available: false, message: 'Bu username band' });
    }
    
    return res.status(200).json({ available: true, message: 'Username mavjud' });
  } catch (err) {
    console.error('checkUsername xato:', err);
    return res.status(500).json({ available: false, message: 'Server xatosi' });
  }
};

export { register, login, getMe, changePassword, checkUsername };
