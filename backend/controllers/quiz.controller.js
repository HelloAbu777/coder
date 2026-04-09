import { Quiz, QuizResult } from '../models/quiz.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

// @returns {Array} — video uchun testlar (faqat video ko'rilgandan keyin)
const getQuizByVideo = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ video: req.params.videoId });
    if (!quiz) return res.status(404).json({ message: 'Test topilmadi' });

    // Foydalanuvchi bu videoni ko'rganmi tekshirish
    const hasWatched = req.user.completedVideos?.some(
      (id) => id.toString() === req.params.videoId
    );
    if (!hasWatched) {
      return res.status(403).json({ message: 'Bu testga kirish uchun avval videoni ko\'rib bo\'ling' });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — bo'lim bo'yicha birinchi test
const getQuizBySection = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ section: req.params.section, isCheckpoint: { $ne: true } });
    if (!quiz) return res.status(404).json({ message: 'Test topilmadi' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — checkpoint test
const getCheckpointQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ section: req.params.section, isCheckpoint: true });
    if (!quiz) return res.status(404).json({ message: 'Checkpoint test topilmadi' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — test natijasini saqlash
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Test topilmadi' });

    let wrongCount = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] !== q.correctIndex) wrongCount++;
    });

    // Ball tizimi: 0 xato=10, 1 xato=9, 2 xato=8, 3+=fail
    const maxWrong = 2;
    const passed = wrongCount <= maxWrong;
    const earnedPoints = passed ? Math.max(10 - wrongCount, 8) : 0;
    const correctCount = quiz.questions.length - wrongCount;

    await QuizResult.create({
      user: req.user._id,
      quiz: quizId,
      score: earnedPoints,
      passed,
      answers
    });

    const user = await User.findById(req.user._id);

    if (passed) {
      const alreadyDone = user.completedQuizzes.some((id) => id.toString() === quizId);
      if (!alreadyDone) {
        user.completedQuizzes.push(quizId);
        user.totalScore += earnedPoints;

        const newLevel = user.calculateLevel();
        const levelChanged = newLevel !== user.level;
        if (levelChanged) user.level = newLevel;

        await user.save();

        if (levelChanged) {
          await Notification.create({
            user: user._id,
            type: 'level_up',
            title: 'Darajangiz ko\'tarildi!',
            message: `Yangi darajangiz: ${newLevel}`,
            link: '/dashboard'
          });
        }
      }
    }

    await Notification.create({
      user: req.user._id,
      type: 'quiz_result',
      title: passed ? `Test o'tildi! +${earnedPoints} ball` : 'Test o\'tilmadi (3+ xato)',
      message: passed ? `${wrongCount} xato, ${earnedPoints} ball` : `${wrongCount} xato — qayta urinib ko'ring`,
      link: '/quiz'
    });

    res.json({ passed, earnedPoints, wrongCount, correctCount, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Array} — foydalanuvchi test natijalari
const getMyResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id }).populate('quiz', 'title section');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — admin: test yaratish
const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — admin: testni o'chirish
const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getQuizByVideo, getCheckpointQuiz, getQuizBySection, submitQuiz, getMyResults, createQuiz, deleteQuiz };
