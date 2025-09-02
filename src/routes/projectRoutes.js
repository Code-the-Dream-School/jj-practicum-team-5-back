const { express } = require('express');
const upload = require('../utils/upload');
const projects = require('../controllers/projectController');

const router = Router();

// POST uses multipart/form-data with field name 'image'
router.route('/')
  .get(projects.getAllProjects)
  .post(upload.single('image'), projects.createProject);

router.route('/:id')
  .get(projects.getProjectById)
  .patch(upload.single('image'), projects.updateProject)
  .delete(projects.deleteProject);

module.exports = router;

