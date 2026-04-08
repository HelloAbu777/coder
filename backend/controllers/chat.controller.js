import Message from '../models/chat.model.js';

// @returns {Array} — xabarlarni olish (room bo'yicha)
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId, isDeleted: false })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — xabar yuborish
const sendMessage = async (req, res) => {
  try {
    const { content, roomId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      content,
      roomId
    });
    const populated = await message.populate('sender', 'name avatar role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — xabarni o'chirish (faqat o'z xabari yoki admin)
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Xabar topilmadi' });

    const isOwner = message.sender.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Ruxsat yo\'q' });

    message.isDeleted = true;
    await message.save();
    res.json({ message: 'Xabar o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMessages, sendMessage, deleteMessage };
