const Project = require('../models/Project');
const fs = require('fs/promises');
const path = require('path');
const Step    = require('../models/Step');


function normalizeInitialSteps(raw) {
  if (!raw) return [];
  let arr = raw;

  // If input is a stringified JSON, parse it
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw);
    } catch {
      return []; // invalid JSON string
    }
  }

  // Only accept arrays of strings
  if (!Array.isArray(arr)) return [];

  return arr
    .filter(s => typeof s === 'string' && s.trim())
    .map((title, i) => ({
      name: title.trim(),
      order: i + 1,
      description: '',
      status: 'Not Started',
      subSteps: []
    }));
}

exports.createProject = async (req, res) => {
  try {
    const { title, deadline, description, initialSteps } = req.body;

    if (!title?.trim()) return res.status(400).json({ error: 'title is required' });
    if (!deadline || Number.isNaN(Date.parse(deadline)))
      return res.status(400).json({ error: 'deadline must be a valid date (yyyy-mm-dd or ISO)' });

    // 1) Create the project
    const project = await Project.create({
      title: title.trim(),
      deadline: new Date(deadline),
      description: description ?? '',
      imageFilename: req.file ? req.file.filename : null,
    });

    // 2) Optionally create initial Step documents
    const steps = normalizeInitialSteps(initialSteps).map(s => ({
      ...s,
      projectId: project._id,
    }));
    if (steps.length) await Step.insertMany(steps);

    res.status(201).json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 
exports.getAllProjects = async (req, res) => {
  const projects = await Project.find().sort('-createdAt');
  res.json({ projects, count: projects.length });
};
 
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.title !== undefined) {
      if (!String(req.body.title).trim()) return res.status(400).json({ error: 'title cannot be empty' });
      updates.title = String(req.body.title).trim();
    }
    if (req.body.deadline !== undefined) {
      if (Number.isNaN(Date.parse(req.body.deadline))) return res.status(400).json({ error: 'deadline must be a valid date' });
      updates.deadline = new Date(req.body.deadline);
    }
    if (req.body.description !== undefined) {
      updates.description = String(req.body.description);
    }
    if (req.body.initialSteps !== undefined) {
      updates.initialSteps = parseInitialSteps(req.body.initialSteps);
    }
    if (req.file) {
      // replace image: delete old one if exists
      const old = await Project.findById(id).select('imageFilename');
      if (!old) return res.status(404).json({ error: 'Project not found' });
      if (old.imageFilename) {
        const p = path.join('uploads', 'projects', old.imageFilename);
        fs.unlink(p).catch(() => {}); // ignore if missing
      }
      updates.imageFilename = req.file.filename;
    }

    const project = await Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
 
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.imageFilename) {
      const p = path.join('uploads', 'projects', project.imageFilename);
      fs.unlink(p).catch(() => {});
    }

    res.json({ message: 'Deleted', project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
