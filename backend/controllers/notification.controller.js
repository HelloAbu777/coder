import Notification from '../models/notification.model.js';

// @returns {Array} — foydalanuvchi bildirishnomalari
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Number} — o'qilmagan bildirishnomalar soni
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — bildirishnomani o'qildi deb belgilash
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'O\'qildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — barchasini o'qildi deb belgilash
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'Barchasi o\'qildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getNotifications, getUnreadCount, markAsRead, markAllRead };
