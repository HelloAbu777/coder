import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // 4 ta variant
  correctIndex: { type: Number, required: true } // to'g'ri javob indeksi
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' }, // video uchun test
    section: { type: String, enum: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'] },
    isCheckpoint: { type: Boolean, default: false }, // bo'lim yakuniy testi
    questions: [questionSchema],
    passingScore: { type: Number, default: 80 } // o'tish uchun minimal ball
  },
  { timestamps: true }
);

// Quiz natijasi
const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    answers: [{ type: Number }] // foydalanuvchi tanlagan javoblar indekslari
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
