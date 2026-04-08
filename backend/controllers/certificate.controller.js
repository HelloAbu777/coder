import Certificate from '../models/certificate.model.js';
import { QuizResult } from '../models/quiz.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { generateCertificatePDF } from '../utils/pdf.utils.js';
import { sendEmail, certificateTemplate } from '../utils/email.utils.js';
import { v4 as uuidv4 } from 'uuid';

// @returns {Array} — foydalanuvchi sertifikatlari
const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user._id }).sort({ issuedAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — checkpoint o'tgandan so'ng sertifikat yaratish
const generateCertificate = async (req, res) => {
  try {
    const { section } = req.body;

    // Bo'lim uchun allaqachon sertifikat bormi
    const existing = await Certificate.findOne({ user: req.user._id, section });
    if (existing) return res.status(400).json({ message: 'Bu bo\'lim uchun sertifikat allaqachon bor' });

    // Checkpoint testdan 85+ ball olgandimi
    const checkpointResult = await QuizResult.findOne({
      user: req.user._id,
      passed: true,
      score: { $gte: 85 }
    }).populate({ path: 'quiz', match: { section, isCheckpoint: true } });

    if (!checkpointResult || !checkpointResult.quiz) {
      return res.status(400).json({ message: 'Checkpoint testdan 85+ ball olish kerak' });
    }

    const uniqueId = uuidv4();
    const pdfUrl = await generateCertificatePDF(req.user.name, section, uniqueId, new Date());

    const cert = await Certificate.create({
      user: req.user._id,
      section,
      uniqueId,
      pdfUrl
    });

    // Sertifikat bo'limini completed sektionsga qo'shish
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { completedSections: section }
    });

    // Bildirishnoma
    await Notification.create({
      user: req.user._id,
      type: 'certificate',
      title: 'Sertifikat berildi!',
      message: `${section} bo'limi uchun sertifikat oldingiz`,
      link: '/certificates'
    });

    // Email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `CODERS — ${section} sertifikatingiz tayyor!`,
        html: certificateTemplate(req.user.name, section)
      });
    } catch (_) {}

    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMyCertificates, generateCertificate };
