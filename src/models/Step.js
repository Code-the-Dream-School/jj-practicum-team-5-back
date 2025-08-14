const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema(
  { 
    projectId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },

    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
 
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },

    order: { type: Number, required: true, min: 1, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Step', StepSchema);
