import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sender: { type: String, enum: ['user', 'gpt'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
