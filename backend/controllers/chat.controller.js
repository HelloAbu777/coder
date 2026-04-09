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
    const message = await Message.create({ sender: req.user._id, content, roomId });
    const populated = await message.populate('sender', 'name avatar role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — xabarni tahrirlash
const editMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Xabar topilmadi' });

    const isOwner = message.sender.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Faqat o\'z xabaringizni tahrirlash mumkin' });

    message.content = req.body.content;
    message.isEdited = true;
    await message.save();
    const populated = await message.populate('sender', 'name avatar role');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — xabarni o'chirish (o'z xabari yoki admin/mentor)
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Xabar topilmadi' });

    const isOwner = message.sender.toString() === req.user._id.toString();
    const isPrivileged = ['admin', 'mentor'].includes(req.user.role);
    if (!isOwner && !isPrivileged) return res.status(403).json({ message: 'Ruxsat yo\'q' });

    message.isDeleted = true;
    await message.save();
    res.json({ message: 'Xabar o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — bir nechta xabarni o'chirish
const bulkDeleteMessages = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'ids massivi kerak' });

    const messages = await Message.find({ _id: { $in: ids } });
    const isPrivileged = ['admin', 'mentor'].includes(req.user.role);

    const allowedIds = messages
      .filter((m) => m.sender.toString() === req.user._id.toString() || isPrivileged)
      .map((m) => m._id);

    await Message.updateMany({ _id: { $in: allowedIds } }, { isDeleted: true });
    res.json({ deleted: allowedIds.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMessages, sendMessage, editMessage, deleteMessage, bulkDeleteMessages };
