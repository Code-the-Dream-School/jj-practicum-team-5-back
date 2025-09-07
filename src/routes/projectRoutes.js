const express = require("express");
const Project = require("../models/Project");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + ext;
        cb(null, name);
    }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, description = "", dueDate, steps = "[]" } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({ message: "Title and dueDate are required" });
        }

        let parsedSteps = [];
        try {
            parsedSteps = JSON.parse(steps).map((s, idx) => ({
                id: idx + 1,
                title: s.title || "",
                completed: false
            }));
        } catch (err) {
            parsedSteps = [];
        }

        const newProject = new Project({
            title: title.trim(),
            description: description.trim(),
            date: dueDate,
            steps: parsedSteps,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        await newProject.save();

        res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create project" });
    }
});

module.exports = router;
