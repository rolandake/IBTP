import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  message: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);
export default Interaction;
