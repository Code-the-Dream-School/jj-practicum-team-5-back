// src/controllers/step.controller.js
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Step = require('../models/Step');

/**
 * GET /projects/:projectId/steps
 * Return all steps for a given project, sorted by 'order' ascending
 */
const getAllStepsByProject = async (req, res) => {
  const { projectId } = req.params;

  // Basic validation for ObjectId shape 
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new BadRequestError('Invalid projectId');
  }

  const steps = await Step.find({ projectId }).sort('order');
  res.status(StatusCodes.OK).json({ steps, count: steps.length });
};

/**
 * GET /steps/:id
 * Return a single step by its id
 */
const getStep = async (req, res) => {
  const { id: stepId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(stepId)) {
    throw new BadRequestError('Invalid step id');
  }

  const step = await Step.findById(stepId);
  if (!step) {
    throw new NotFoundError(`No step with id ${stepId}`);
  }

  res.status(StatusCodes.OK).json({ step });
};

/**
 * POST /projects/:projectId/steps
 * Create a new step
 * - If 'order' is provided: shift all steps with order >= given 'order' by +1
 * - If 'order' is not provided: place the step at the end (max(order)+1 or 1)
 */
const createStep = async (req, res) => {
  const { projectId } = req.params;
  const { name, description = '', status, order } = req.body;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new BadRequestError('Invalid projectId');
  }
  if (!name || !String(name).trim()) {
    throw new BadRequestError('Step name is required');
  }

  let finalOrder = order;

  if (finalOrder === undefined || finalOrder === null) {
    // Place at the end of the list
    const last = await Step.findOne({ projectId }).sort('-order');
    finalOrder = last ? last.order + 1 : 1;
  } else {
    if (Number.isNaN(Number(finalOrder)) || Number(finalOrder) < 1) {
      throw new BadRequestError('order must be a number >= 1');
    }
    // Shift existing steps >= finalOrder down by 1
    await Step.updateMany(
      { projectId, order: { $gte: finalOrder } },
      { $inc: { order: 1 } }
    );
  }

  // Create the step
  const step = await Step.create({
    projectId,
    name: String(name).trim(),
    description,
    status, 
    order: finalOrder,
  });

  res.status(StatusCodes.CREATED).json({ step });
};

/**
 * PATCH /steps/:id
 * Update step fields (name/description/status) and optionally move its 'order'
 * Reordering rules:
 *  - If newOrder < oldOrder: increment (+1) steps in [newOrder, oldOrder-1]
 *  - If newOrder > oldOrder: decrement (-1) steps in [oldOrder+1, newOrder]
 *  - If newOrder is beyond the end, bound it to the current max (place at the end)
 */
const updateStep = async (req, res) => {
  const { id: stepId } = req.params;
  const { name, description, status, order: newOrder } = req.body;

  if (!mongoose.Types.ObjectId.isValid(stepId)) {
    throw new BadRequestError('Invalid step id');
  }

  const step = await Step.findById(stepId);
  if (!step) {
    throw new NotFoundError(`No step with id ${stepId}`);
  }

  // Update simple fields
  if (name !== undefined) {
    if (!String(name).trim()) {
      throw new BadRequestError('Step name cannot be empty');
    }
    step.name = String(name).trim();
  }
  if (description !== undefined) step.description = description;
  if (status !== undefined) step.status = status;

  // Handle order movement if provided
  if (newOrder !== undefined && newOrder !== null && newOrder !== step.order) {
    const projectId = step.projectId;
    const oldOrder = step.order;

    if (Number.isNaN(Number(newOrder)) || Number(newOrder) < 1) {
      throw new BadRequestError('order must be a number >= 1');
    }

    // Get the current max order to bound the target position
    const maxRow = await Step.findOne({ projectId }).sort('-order');
    const maxOrder = maxRow ? maxRow.order : 1;
    const target = Math.min(Number(newOrder), maxOrder);

    if (target < oldOrder) {
      // Move up: push down others in [target, oldOrder-1]
      await Step.updateMany(
        { projectId, order: { $gte: target, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    } else if (target > oldOrder) {
      // Move down: pull up others in (oldOrder, target]
      await Step.updateMany(
        { projectId, order: { $gt: oldOrder, $lte: target } },
        { $inc: { order: -1 } }
      );
    }

    step.order = target;
  }

  await step.save();
  res.status(StatusCodes.OK).json({ step });
};

/**
 * DELETE /steps/:id
 * Delete a step and compact orders:
 *  - Decrement (-1) the order of all steps with order > deleted.order
 */
const deleteStep = async (req, res) => {
  const { id: stepId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(stepId)) {
    throw new BadRequestError('Invalid step id');
  }

  // Find step to know its projectId and order
  const step = await Step.findById(stepId);
  if (!step) {
    throw new NotFoundError(`No step with id ${stepId}`);
  }

  const { projectId, order } = step;

  // Delete the step
  await Step.deleteOne({ _id: stepId });

  // Compact remaining orders
  await Step.updateMany(
    { projectId, order: { $gt: order } },
    { $inc: { order: -1 } }
  );

  res.status(StatusCodes.OK).json({ msg: 'The step was deleted.' });
};

module.exports = {
  getAllStepsByProject,
  getStep,
  createStep,
  updateStep,
  deleteStep,
};
