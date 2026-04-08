// @returns {void} — ruxsat berilgan rollarni tekshiradi
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Avtorizatsiya talab etiladi' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bu sahifaga kirishga ruxsat yo\'q' });
    }
    next();
  };
};

export default roleMiddleware;
