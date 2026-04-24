import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB ga ulandi');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      username: { type: String, unique: true },
      email: { type: String, unique: true },
      password: String,
      role: String,
      isPaid: Boolean,
      isEmailVerified: Boolean,
      level: String,
      totalScore: Number,
      completedVideos: [mongoose.Schema.Types.ObjectId],
      completedQuizzes: [mongoose.Schema.Types.ObjectId],
      completedSections: [String]
    }, { timestamps: true }));

    // Mavjud adminni tekshirish
    const existingAdmin = await User.findOne({ email: 'admin@coders.uz' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin allaqachon mavjud');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🎭 Role:', existingAdmin.role);
      
      // Parolni yangilash
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isPaid = true;
      await existingAdmin.save();
      console.log('✅ Admin paroli yangilandi');
    } else {
      // Yangi admin yaratish
      const hashedPassword = await bcrypt.hash('Admin123!', 12);
      
      const admin = await User.create({
        name: 'Admin',
        username: 'admin_coders',
        email: 'admin@coders.uz',
        password: hashedPassword,
        role: 'admin',
        isPaid: true,
        isEmailVerified: true,
        level: 'Pro',
        totalScore: 0,
        completedVideos: [],
        completedQuizzes: [],
        completedSections: []
      });

      console.log('✅ Admin muvaffaqiyatli yaratildi!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Parol: Admin123!');
      console.log('👤 Username:', admin.username);
      console.log('🎭 Role:', admin.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    console.log('\n🔐 LOGIN MA\'LUMOTLARI:');
    console.log('URL: http://localhost:5173/login');
    console.log('Email: admin@coders.uz');
    console.log('Parol: Admin123!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Xato:', err.message);
    process.exit(1);
  }
};

createAdmin();
