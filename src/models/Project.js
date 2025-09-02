const mongoose = require('mongoose');

 

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    deadline: { type: Date, required: true },
    description: { type: String, default: '' },
    imageFilename: { type: String, default: null },
  },
  { timestamps: true, collection: 'projects' }
);

module.exports = mongoose.model('Project', projectSchema);
