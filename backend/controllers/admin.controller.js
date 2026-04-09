import User from '../models/user.model.js';
import Payment from '../models/payment.model.js';
import Video from '../models/video.model.js';

// @returns {Array} — barcha foydalanuvchilar
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — foydalanuvchini bloklash/blokdan chiqarish
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: user.isBlocked ? 'Bloklandi' : 'Blok olib tashlandi', isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — foydalanuvchini o'chirish
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Foydalanuvchi o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — foydalanuvchiga mentor roli berish
const assignMentor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'mentor' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — foydalanuvchi rolini o'zgartirish
const changeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ['visitor', 'student', 'mentor'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Noto\'g\'ri rol' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Array} — barcha to'lovlar
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — to'lovni qaytarish (refund)
const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'To\'lov topilmadi' });
    if (payment.status !== 'paid') return res.status(400).json({ message: 'Faqat to\'langan to\'lovni qaytarish mumkin' });

    payment.status = 'refunded';
    await payment.save();
    await User.findByIdAndUpdate(payment.user, { isPaid: false, role: 'visitor' });

    res.json({ message: 'To\'lov qaytarildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — dashboard statistika
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalPaid = await Payment.countDocuments({ status: 'paid' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalVideos = await Video.countDocuments();

    res.json({
      totalUsers,
      totalPaid,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalVideos
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getUsers, toggleBlockUser, deleteUser, assignMentor, changeRole, getPayments, refundPayment, getStats };
