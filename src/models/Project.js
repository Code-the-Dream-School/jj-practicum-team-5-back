const mongoose = require("mongoose");

// Subtask schema: represents the smallest unit inside a step
const subtaskSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // local incremental ID within a step
  title: { type: String, required: true }, // subtask title
  done: { type: Boolean, default: false }, // completion flag
});

// Step schema: represents a step in a project
const stepSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // local incremental ID within a project
  title: { type: String, required: true }, // step title
  description: { type: String, default: "" }, // optional step description
  completed: { type: Boolean, default: false }, // legacy completion flag
  dueDate: { type: Date, default: null }, // step deadline (date type for better queries)
  subtasks: { type: [subtaskSchema], default: [] }, // list of subtasks
});

// Project schema: represents the whole project
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // project title
    description: { type: String, default: "" }, // project description
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to user
    status: {
      type: String,
      enum: ["Not started", "In Progress", "Completed", "Overdue"], // allowed statuses
      default: "Not started",
    },
    dueDate: { type: Date, required: true }, // project-level deadline
    image: { type: String, default: null }, // optional image path
    steps: { type: [stepSchema], default: [] }, // array of project steps
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt
  }
);

module.exports = mongoose.model("Project", projectSchema);
