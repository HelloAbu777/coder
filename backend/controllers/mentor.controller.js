import User from '../models/user.model.js';

// @returns {Array} — mentor: o'quvchilar ro'yxati
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email level totalScore completedVideos completedSections avatar createdAt')
      .sort({ totalScore: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — bitta o'quvchi ma'lumoti
const getStudent = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' })
      .select('-password');
    if (!student) return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getStudents, getStudent };