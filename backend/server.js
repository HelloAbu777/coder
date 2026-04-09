import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import videoRoutes from './routes/video.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import chatRoutes from './routes/chat.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import codeRoutes from './routes/code.routes.js';
import adminRoutes from './routes/admin.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import profileRoutes from './routes/profile.routes.js';
import notificationRoutes from './routes/notification.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://coder-beta-amber.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS ruxsat etilmagan'));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.IO — real-time chat
io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('delete_message', ({ messageId, roomId }) => {
    io.to(roomId).emit('message_deleted', messageId);
  });

  socket.on('bulk_delete_messages', ({ ids, roomId }) => {
    io.to(roomId).emit('messages_bulk_deleted', ids);
  });

  socket.on('edit_message', ({ message, roomId }) => {
    io.to(roomId).emit('message_edited', message);
  });

  socket.on('disconnect', () => {});
});

// MongoDB ulanish
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server ${process.env.PORT || 5000} portda ishlamoqda`);
    });
  })
  .catch((err) => {
    console.error('MongoDB ulanishda xato:', err.message);
  });

export { io };
