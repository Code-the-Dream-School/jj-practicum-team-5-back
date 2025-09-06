<<<<<<< Updated upstream
const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Not started', 'In Progress', 'Completed', 'Overdue'],
        default: 'Not started'
    },
    date: { type: String, required: true },
    image: { type: String },
    steps: [stepSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
=======
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    date: { type: String },
    status: { type: String, enum: ["Completed", "In Progress", "Not started", "Overdue"], default: "Not started" },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
>>>>>>> Stashed changes
