const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
        type: String,
        enum: ['Not started', 'In Progress', 'Completed', 'Overdue'],
        default: 'Not started'
    },
    date: { type: String, required: true  },
    image: { type: String, default: null },
    steps: { type: [stepSchema], default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
