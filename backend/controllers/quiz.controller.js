import { Quiz, QuizResult } from '../models/quiz.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

// @returns {Array} — video uchun testlar
const getQuizByVideo = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ video: req.params.videoId });
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

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const result = await QuizResult.create({
      user: req.user._id,
      quiz: quizId,
      score,
      passed,
      answers
    });

    const user = await User.findById(req.user._id);

    if (passed) {
      const alreadyDone = user.completedQuizzes.some((id) => id.toString() === quizId);
      if (!alreadyDone) {
        user.completedQuizzes.push(quizId);
        user.totalScore += score;

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
      title: passed ? 'Test muvaffaqiyatli o\'tildi!' : 'Test o\'tilmadi',
      message: `Ball: ${score}%`,
      link: '/quiz'
    });

    res.json({ score, passed, correctCount: correct, total: quiz.questions.length });
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

export { getQuizByVideo, getCheckpointQuiz, submitQuiz, getMyResults, createQuiz, deleteQuiz };
