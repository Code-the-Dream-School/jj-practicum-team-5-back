const express = require("express");
const Project = require("../models/Project");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // all project routes require authentication

// GET all projects for the current user
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, projects });
  } catch (err) {
    console.error("Error in GET /projects:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: err.message,
    });
  }
});

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id, // only allow owner to fetch their project
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, project });
  } catch (err) {
    console.error("Error in GET /projects/:id:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: err.message,
    });
  }
});

// CREATE new project
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description = "", dueDate, steps = "[]" } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title and dueDate are required",
      });
    }

    let parsedSteps = [];
    try {
      parsedSteps = JSON.parse(steps).map((s, idx) => ({
        id: idx + 1,
        title: s.title || "",
        description: s.description || "",
        completed: false,
        dueDate: s.dueDate || null,
        subtasks: (s.subtasks || []).map((t, tidx) => ({
          id: tidx + 1,
          title: t.title || "",
          done: !!t.done,
        })),
      }));
    } catch {
      parsedSteps = [];
    }

    const newProject = new Project({
      title: title.trim(),
      description: description.trim(),
      userId: req.user._id,
      dueDate, // must match schema
      steps: parsedSteps,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error in POST /projects:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// UPDATE project
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Handle file upload
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // If steps are sent as JSON string → parse them
    if (typeof updateData.steps === "string") {
      try {
        updateData.steps = JSON.parse(updateData.steps);
      } catch {
        updateData.steps = [];
      }
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error("Error in PUT /projects/:id:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: err.message,
    });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error in DELETE /projects/:id:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: err.message,
    });
  }
});

module.exports = router;
