const Project = require("../models/Project");

// Create a project
exports.createProject = async (req, res) => {
    console.log('req.user:', req.user);
    try {
        const newProject = new Project({
            title: req.body.title,
            description: req.body.description || "",
            userId: req.user._id,
            status: req.body.status || "Not started",
            image: req.file ? "/uploads/" + req.file.filename : null,
            date: req.body.date || new Date().toISOString().split("T")[0],
            steps: []
        });
        console.log('req.user:', req.user);
        await newProject.save();

        res.status(201).json({
            success: true,
            data: newProject
        });
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: projects.length, data: projects
        });
    } catch (err) {
        console.error("Error fetching projects:", err);
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
            project
        });
    } catch (err) {
        console.error("Error fetching project:", err);
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
            project
        });
    } catch (err) {
        console.error("Error updating project:", err);
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
            project
        });
    } catch (err) {
        console.error("Error deleting project:", err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
