const { Router } = require('express');
const steps = require('../controllers/stepsController'); 
 const sub = require('../controllers/subStepsController'); 

const router = Router();
 
// steps 
router.route('/projects/:projectId').get(steps.getAllStepsByProject).post(steps.createStep); 
router.route('/:id').patch(steps.updateStep).delete(steps.deleteStep);

// sub-steps
router.route('/:stepId/substeps')
  .get(sub.list)     
  .post(sub.create);  

router.route('/:stepId/substeps/:subId')
  .patch(sub.update)  
  .delete(sub.remove);

module.exports = router;
