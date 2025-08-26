const express = require("express");
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

router.post("/", createProject);            
router.get("/", getAllProjects);           
router.get("/:id", getProjectById);        
router.put("/:id", updateProject);         
router.delete("/:id", deleteProject);      

module.exports = router;
