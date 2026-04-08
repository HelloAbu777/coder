import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// @returns {void} — token tekshiradi, req.user ni to'ldiradi
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    if (user.isBlocked) return res.status(403).json({ message: 'Hisobingiz bloklangan' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token yaroqsiz' });
  }
};

export default authMiddleware;
