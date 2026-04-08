import CodeProject from '../models/code-project.model.js';

const MAX_PROJECTS = 20;
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

// @returns {Array} — foydalanuvchi loyihalari
const getProjects = async (req, res) => {
  try {
    const projects = await CodeProject.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — bitta loyiha
const getProject = async (req, res) => {
  try {
    const project = await CodeProject.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Loyiha topilmadi' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — yangi loyiha yaratish
const createProject = async (req, res) => {
  try {
    const count = await CodeProject.countDocuments({ user: req.user._id });
    if (count >= MAX_PROJECTS) {
      return res.status(400).json({ message: `Maksimal ${MAX_PROJECTS} ta loyiha yaratish mumkin` });
    }

    const project = await CodeProject.create({ user: req.user._id, name: req.body.name, files: [] });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — fayl qo'shish / yangilash
const saveFile = async (req, res) => {
  try {
    const { fileName, language, content } = req.body;

    if (Buffer.byteLength(content, 'utf8') > MAX_FILE_SIZE) {
      return res.status(400).json({ message: 'Fayl hajmi 1MB dan oshmasligi kerak' });
    }

    const project = await CodeProject.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Loyiha topilmadi' });

    const existingIndex = project.files.findIndex((f) => f.name === fileName);
    if (existingIndex >= 0) {
      project.files[existingIndex].content = content;
      project.files[existingIndex].size = Buffer.byteLength(content, 'utf8');
    } else {
      project.files.push({ name: fileName, language, content, size: Buffer.byteLength(content, 'utf8') });
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @returns {Object} — loyihani o'chirish
const deleteProject = async (req, res) => {
  try {
    await CodeProject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Loyiha o\'chirildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getProjects, getProject, createProject, saveFile, deleteProject };
