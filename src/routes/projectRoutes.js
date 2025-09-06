<<<<<<< Updated upstream
const express = require("express");
const Project = require("../models/Project");
const photoUpload = require("../middlewares/photoUpload");

const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

router.post("/", photoUpload.single("image"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);


module.exports = router;
=======
import express from "express";

import Project from "../models/Project.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
>>>>>>> Stashed changes
