import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, required: true }, // video URL (YouTube embed yoki S3)
    section: {
      type: String,
      enum: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'],
      required: true
    },
    order: { type: Number, required: true }, // bo'lim ichida tartib raqami
    duration: { type: Number, default: 0 }, // sekundda
    isCheckpoint: { type: Boolean, default: false }, // bo'lim yakuniy testi
    thumbnail: { type: String, default: '' },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;
