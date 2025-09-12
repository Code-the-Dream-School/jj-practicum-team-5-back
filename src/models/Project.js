const mongoose = require("mongoose");

// Subtask schema
const subtaskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
});

// Step schema
const stepSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, default: null },
  subtasks: { type: [subtaskSchema], default: [] }, // ✅ added subtasks
});

// Project schema
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Not started", "In Progress", "Completed", "Overdue"],
      default: "Not started",
    },
    dueDate: { type: Date, required: true }, // ✅ renamed from "date"
    image: { type: String, default: null },
    steps: { type: [stepSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
