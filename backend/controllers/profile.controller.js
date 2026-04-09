import User from '../models/user.model.js';
import Certificate from '../models/certificate.model.js';

// @returns {Object} — public profil (username bo'yicha)
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('name username level completedSections avatar createdAt');
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    const certificates = await Certificate.find({ user: user._id }).select('section issuedAt uniqueId');
    res.json({ user, certificates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — o'z profilini yangilash
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Array} — leaderboard (top 20)
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name level totalScore completedVideos completedSections avatar')
      .sort({ totalScore: -1, completedVideos: -1 })
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getPublicProfile, updateProfile, getLeaderboard };
