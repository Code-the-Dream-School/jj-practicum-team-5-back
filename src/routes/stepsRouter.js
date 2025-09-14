const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // require authentication

// ---------- STEPS ----------

// Create step
router.post("/:projectId/steps", async (req, res) => {
  try {
    const { title, description = "", dueDate } = req.body;
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const steps = project.steps || [];
    const nextId = steps.length ? Math.max(...steps.map((s) => s.id)) + 1 : 1;

    const newStep = {
      id: nextId,
      title,
      description,
      dueDate: dueDate || null,
      completed: false,
      subtasks: [],
    };

    project.steps.push(newStep);
    await project.save();

    res.json({ success: true, step: newStep });
  } catch (err) {
    console.error("Error creating step:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create step",
      error: err.message,
    });
  }
});

// Update step
router.put("/:projectId/steps/:stepId", async (req, res) => {
  try {
    const { projectId, stepId } = req.params;
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const step = project.steps.find((s) => s.id === Number(stepId));
    if (!step) {
      return res
        .status(404)
        .json({ success: false, message: "Step not found" });
    }

    Object.assign(step, req.body);
    await project.save();

    res.json({ success: true, step });
  } catch (err) {
    console.error("Error updating step:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update step",
      error: err.message,
    });
  }
});

// Delete step
router.delete("/:projectId/steps/:stepId", async (req, res) => {
  try {
    const { projectId, stepId } = req.params;
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    project.steps = project.steps.filter((s) => s.id !== Number(stepId));
    await project.save();

    res.json({ success: true, message: "Step deleted" });
  } catch (err) {
    console.error("Error deleting step:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete step",
      error: err.message,
    });
  }
});

// ---------- SUBTASKS ----------

// Add subtask
router.post("/:projectId/steps/:stepId/subtasks", async (req, res) => {
  try {
    const { projectId, stepId } = req.params;
    const { title } = req.body;
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const step = project.steps.find((s) => s.id === Number(stepId));
    if (!step) {
      return res
        .status(404)
        .json({ success: false, message: "Step not found" });
    }

    const subtasks = step.subtasks || [];
    const nextId = subtasks.length
      ? Math.max(...subtasks.map((t) => t.id)) + 1
      : 1;

    const newSubtask = { id: nextId, title, done: false };
    step.subtasks.push(newSubtask);
    await project.save();

    res.json({ success: true, subtask: newSubtask });
  } catch (err) {
    console.error("Error creating subtask:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create subtask",
      error: err.message,
    });
  }
});

// Update subtask
router.put(
  "/:projectId/steps/:stepId/subtasks/:subtaskId",
  async (req, res) => {
    try {
      const { projectId, stepId, subtaskId } = req.params;
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id,
      });
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }

      const step = project.steps.find((s) => s.id === Number(stepId));
      if (!step) {
        return res
          .status(404)
          .json({ success: false, message: "Step not found" });
      }

      const subtask = step.subtasks.find((t) => t.id === Number(subtaskId));
      if (!subtask) {
        return res
          .status(404)
          .json({ success: false, message: "Subtask not found" });
      }

      Object.assign(subtask, req.body);
      await project.save();

      res.json({ success: true, subtask });
    } catch (err) {
      console.error("Error updating subtask:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update subtask",
        error: err.message,
      });
    }
  }
);

// Delete subtask
router.delete(
  "/:projectId/steps/:stepId/subtasks/:subtaskId",
  async (req, res) => {
    try {
      const { projectId, stepId, subtaskId } = req.params;
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id,
      });
      if (!project) {
        return res
          .status(404)
          .json({ success: false, message: "Project not found" });
      }

      const step = project.steps.find((s) => s.id === Number(stepId));
      if (!step) {
        return res
          .status(404)
          .json({ success: false, message: "Step not found" });
      }

      step.subtasks = step.subtasks.filter((t) => t.id !== Number(subtaskId));
      await project.save();

      res.json({ success: true, message: "Subtask deleted" });
    } catch (err) {
      console.error("Error deleting subtask:", err);
      res.status(500).json({
        success: false,
        message: "Failed to delete subtask",
        error: err.message,
      });
    }
  }
);

module.exports = router;
