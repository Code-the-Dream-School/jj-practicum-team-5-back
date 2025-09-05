const mongoose = require('mongoose');

const SubStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    done:  { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

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

    order: { type: Number, required: true, min: 1, index: true },

    subSteps: [SubStepSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Step', StepSchema);
