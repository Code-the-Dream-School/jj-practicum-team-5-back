const { Router } = require('express');
const steps = require('../controllers/stepsController'); 
 

const router = Router();
 
// Get all steps for a project, or create a new step for a project
router.route('/projects/:projectId').get(steps.getAllStepsByProject).post(steps.createStep);

// Update or delete a specific step
router.route('/:id').patch(steps.updateStep).delete(steps.deleteStep);

module.exports = router;
