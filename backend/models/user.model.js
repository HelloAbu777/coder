import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['visitor', 'student', 'mentor', 'admin'],
      default: 'visitor'
    },
    avatar: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Daraja tizimi
    level: {
      type: String,
      enum: ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Pro'],
      default: 'Beginner'
    },
    totalScore: { type: Number, default: 0 },
    completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    completedSections: [{ type: String }],

    // To'lov
    isPaid: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }
  },
  { timestamps: true }
);

// Parolni hash qilish
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Parolni tekshirish
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Daraja hisoblash
userSchema.methods.calculateLevel = function () {
  const videos = this.completedVideos.length;
  const quizzes = this.completedQuizzes.length;
  const sections = this.completedSections.length;
  const certs = 0; // certificates alohida model

  if (sections >= 5) return 'Pro';
  if (sections >= 3 && quizzes >= 50) return 'Advanced';
  if (sections >= 1 && videos >= 25) return 'Intermediate';
  if (videos >= 10 && quizzes >= 5) return 'Elementary';
  return 'Beginner';
};

const User = mongoose.model('User', userSchema);
export default User;
