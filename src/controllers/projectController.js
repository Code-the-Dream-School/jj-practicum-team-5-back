const Project = require("../models/Project");

// Create a project
exports.createProject = async (req, res) => {
    try {
        const { title, description, image, date, status } = req.body;
        const project = await Project.create({ title, description, image, date, status });
        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

// Get one project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }
        res.json({
            success: true,
            data: project
        });
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }
        res.json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }
        res.json({
            success: true,
            message: "Project deleted successfully",
            data: project
        });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};