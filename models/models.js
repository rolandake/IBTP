import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  question: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Interaction = mongoose.model('Interaction', interactionSchema);

export default Interaction;
