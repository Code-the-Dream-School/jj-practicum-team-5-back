const mongoose = require("mongoose");

// Define schema for individual steps inside a project
const stepSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // local numeric ID for ordering steps
  title: { type: String, required: true }, // step title
  completed: { type: Boolean, default: false }, // status flag
  dueDate: { type: Date, default: null }, // ✅ added a due date for each step
});

// Define schema for projects
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // project title
    description: { type: String, default: "" }, // optional description
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link to user
    status: {
      type: String,
      enum: ["Not started", "In Progress", "Completed", "Overdue"],
      default: "Not started",
    },
    dueDate: { type: Date, required: true }, // ✅ renamed from "date" → "dueDate"
    image: { type: String, default: null }, // optional image path
    steps: { type: [stepSchema], default: [] }, // array of step objects
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt
  }
);

// Export the model
module.exports = mongoose.model("Project", projectSchema);
