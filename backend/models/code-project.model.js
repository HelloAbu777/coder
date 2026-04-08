import mongoose from 'mongoose';

const codeFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: {
    type: String,
    enum: ['html', 'css', 'javascript', 'python', 'nodejs'],
    default: 'javascript'
  },
  content: { type: String, default: '' },
  size: { type: Number, default: 0 }
});

const codeProjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    files: [codeFileSchema]
  },
  { timestamps: true }
);

const CodeProject = mongoose.model('CodeProject', codeProjectSchema);
export default CodeProject;
