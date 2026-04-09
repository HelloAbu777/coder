import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    roomId: { type: String, required: true }, // 'general' yoki userId (private chat uchun)
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
