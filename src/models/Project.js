const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Completed", "In Progress", "Not started", "Overdue"],
        default: "Not started"
    },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;