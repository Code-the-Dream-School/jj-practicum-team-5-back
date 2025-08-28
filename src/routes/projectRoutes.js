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
