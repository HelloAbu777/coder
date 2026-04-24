import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Admin yaratish scripti
const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB ga ulandi');

    // Mavjud adminni tekshirish
    const existingAdmin = await User.findOne({ email: 'admin@coders.uz' });
    
    if (existingAdmin) {
      console.log('Admin allaqachon mavjud');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Yangi admin yaratish
    const admin = await User.create({
      name: 'Admin',
      username: 'admin_coders',
      email: 'admin@coders.uz',
      password: 'Admin@2025!Secure', // Qattiq parol
      role: 'admin',
      isPaid: true,
      isEmailVerified: true
    });

    console.log('✅ Admin muvaffaqiyatli yaratildi!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Parol: Admin@2025!Secure');
    console.log('👤 Username:', admin.username);
    console.log('🎭 Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Bu ma\'lumotlarni xavfsiz joyda saqlang!');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Xato:', err.message);
    process.exit(1);
  }
};

createAdmin();
