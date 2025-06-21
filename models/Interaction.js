// models/Interaction.js
import mongoose from 'mongoose'

const interactionSchema = new mongoose.Schema({
  question: String,
  response: String
}, { timestamps: true })

export default mongoose.model('Interaction', interactionSchema)
