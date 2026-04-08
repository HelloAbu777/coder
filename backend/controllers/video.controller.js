import Video from '../models/video.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { sendEmail, newVideoTemplate } from '../utils/email.utils.js';

// @returns {Array} — barcha videolarni qaytaradi
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true }).sort({ section: 1, order: 1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — bitta video
const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video topilmadi' });

    // Foydalanuvchi oldingi videoni ko'rganmi tekshirish
    const user = req.user;
    const videos = await Video.find({ section: video.section, isPublished: true }).sort({ order: 1 });
    const currentIndex = videos.findIndex((v) => v._id.toString() === video._id.toString());

    if (currentIndex > 0) {
      const prevVideo = videos[currentIndex - 1];
      const hasWatched = user.completedVideos.some((id) => id.toString() === prevVideo._id.toString());
      if (!hasWatched) {
        return res.status(403).json({ message: 'Avvalgi videoni ko\'rib bo\'ling' });
      }
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — videoni ko'rildi deb belgilash
const markVideoWatched = async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyWatched = user.completedVideos.some((id) => id.toString() === videoId);
    if (!alreadyWatched) {
      user.completedVideos.push(videoId);
      const newLevel = user.calculateLevel();
      if (newLevel !== user.level) {
        user.level = newLevel;
      }
      await user.save();
    }

    res.json({ message: 'Video ko\'rildi deb belgilandi', level: user.level });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — admin: yangi video qo'shish
const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);

    // Barcha o'quvchilarga bildirishnoma
    const students = await User.find({ role: 'student' });
    const notifications = students.map((s) => ({
      user: s._id,
      type: 'new_video',
      title: 'Yangi dars qo\'shildi',
      message: video.title,
      link: `/videos`
    }));
    await Notification.insertMany(notifications);

    // Email yuborish (faqat birinchi 50 ta)
    for (const student of students.slice(0, 50)) {
      try {
        await sendEmail({
          to: student.email,
          subject: 'CODERS — Yangi dars mavjud!',
          html: newVideoTemplate(student.name, video.title)
        });
      } catch (_) {}
    }

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — admin: videoni tahrirlash
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ message: 'Video topilmadi' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — admin: videoni o'chirish
const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getVideos, getVideo, markVideoWatched, createVideo, updateVideo, deleteVideo };
