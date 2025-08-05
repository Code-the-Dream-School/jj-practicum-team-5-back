const Project = require("../models/Project");

// Create a project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const project = await Project.create({ name, description });
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
};

// Get one project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Not found" });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const result = await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted", project: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
