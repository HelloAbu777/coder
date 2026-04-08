import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    section: {
      type: String,
      enum: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Python'],
      required: true
    },
    uniqueId: { type: String, default: uuidv4, unique: true },
    issuedAt: { type: Date, default: Date.now },
    pdfUrl: { type: String, default: '' } // generated PDF path
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
