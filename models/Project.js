import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  dueDate: { type: Date },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["en cours", "terminé", "en attente"],
    default: "en attente",
  },
  progress: { type: Number, default: 0 }, // valeur en pourcentage 0-100
  tasks: [taskSchema],
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
