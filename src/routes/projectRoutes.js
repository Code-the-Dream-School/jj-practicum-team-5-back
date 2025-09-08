const express = require("express");
const Project = require("../models/Project");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
    try {

        const allProjects = await Project.find({});
        console.log('Sample projects:', allProjects.slice(0, 3).map(p => ({
            _id: p._id,
            title: p.title,
            userId: p.userId
        })));
        const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });


        res.json({
            success: true,
            projects: projects
        });
    } catch (err) {
        console.error('Error in GET /projects:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
            error: err.message
        });
    }
});

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log('POST /projects - req.user:', req.user);
        console.log('POST /projects - req.body:', req.body);

        const { title, description = "", dueDate, steps = "[]" } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Title and dueDate are required"
            });
        }

        let parsedSteps = [];
        try {
            parsedSteps = JSON.parse(steps).map((s, idx) => ({
                id: idx + 1,
                title: s.title || "",
                completed: false
            }));
        } catch {
            parsedSteps = [];
        }

        const newProject = new Project({
            title: title.trim(),
            description: description.trim(),
            userId: req.user._id,
            date: dueDate,
            steps: parsedSteps,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        console.log('Creating project with userId:', req.user._id);

        await newProject.save();

        console.log('Project created successfully:', newProject._id);

        res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create project" });
    }
});

router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updateData,
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
            data: project
        });
    } catch (err) {
        console.error('Error in PUT /projects/:id:', err);
        res.status(500).json({
            success: false,
            message: "Failed to update project",
            error: err.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (err) {
        console.error('Error in DELETE /projects/:id:', err);
        res.status(500).json({
            success: false,
            message: "Failed to delete project",
            error: err.message
        });
    }
});

module.exports = router;
