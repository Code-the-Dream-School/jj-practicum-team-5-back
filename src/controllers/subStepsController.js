 
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Step = require('../models/Step');

// GET /steps/:stepId/substeps
const list = async (req, res) => {
  const { stepId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(stepId)) throw new BadRequestError('Invalid stepId');

  const step = await Step.findById(stepId).select('subSteps');
  if (!step) throw new NotFoundError(`No step with id ${stepId}`);

  res.status(StatusCodes.OK).json({ subSteps: step.subSteps, count: step.subSteps.length });
};

// POST /steps/:stepId/substeps   { title, done? }
const create = async (req, res) => {
  const { stepId } = req.params;
  const { title, done } = req.body;

  if (!mongoose.Types.ObjectId.isValid(stepId)) throw new BadRequestError('Invalid stepId');
  if (!title || !String(title).trim()) throw new BadRequestError('title is required');

  const step = await Step.findByIdAndUpdate(
    stepId,
    { $push: { subSteps: { title: String(title).trim(), done: !!done } } },
    { new: true, runValidators: true, select: 'subSteps' }
  );
  if (!step) throw new NotFoundError(`No step with id ${stepId}`);

  // return just the newly added subStep (last item)
  const created = step.subSteps[step.subSteps.length - 1];
  res.status(StatusCodes.CREATED).json({ subStep: created });
};

// PATCH /steps/:stepId/substeps/:subId   { title?, done? }
const update = async (req, res) => {
  const { stepId, subId } = req.params;
  const { title, done } = req.body;

  if (!mongoose.Types.ObjectId.isValid(stepId) || !mongoose.Types.ObjectId.isValid(subId))
    throw new BadRequestError('Invalid id');

  const set = {};
  if (title !== undefined) {
    if (!String(title).trim()) throw new BadRequestError('title cannot be empty');
    set['subSteps.$.title'] = String(title).trim();
  }
  if (done !== undefined) set['subSteps.$.done'] = !!done;

  const step = await Step.findOneAndUpdate(
    { _id: stepId, 'subSteps._id': subId },
    { $set: set },
    { new: true, runValidators: true, select: 'subSteps' }
  );
  if (!step) throw new NotFoundError(`Sub-step not found`);

  const updated = step.subSteps.id(subId);
  res.status(StatusCodes.OK).json({ subStep: updated });
};

// DELETE /steps/:stepId/substeps/:subId
const remove = async (req, res) => {
  const { stepId, subId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(stepId) || !mongoose.Types.ObjectId.isValid(subId))
    throw new BadRequestError('Invalid id');

  const step = await Step.findByIdAndUpdate(
    stepId,
    { $pull: { subSteps: { _id: subId } } },
    { new: true, select: 'subSteps' }
  );
  if (!step) throw new NotFoundError(`No step with id ${stepId}`);

  res.status(StatusCodes.OK).json({ msg: 'Sub-step deleted.' });
};

module.exports = { list, create, update, remove };
