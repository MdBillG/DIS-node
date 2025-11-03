const {
  createBatchService,
  getBatchesService,
  getBatchByIdService,
  updateBatchByIdService,
  deleteBatchByIdService,
  assignStudentsToBatch,
  assignTeacherToBatch
} = require('../services/batch.service');
const { removeStudentsFromBatch, removeTeacherFromBatch } = require('../services/batch.service');

const createBatchController = async (req, res, next) => {
  try {
    // attach createdBy if user present
    const data = { ...req.body };
    if (req.user?.id) data.createdBy = req.user.id;

    const result = await createBatchService(data);
    res.status(201).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const getBatchesController = async (req, res, next) => {
  try {
    // optional query params: teacher, student
    const filter = {};
    if (req.query.teacher) filter.teacher = req.query.teacher;
    if (req.query.student) filter.students = req.query.student;

    const result = await getBatchesService(filter);
    res.status(200).json({ success: true, count: result.count, data: result.data });
  } catch (error) {
    next(error);
  }
};

const getBatchByIdController = async (req, res, next) => {
  try {
    const result = await getBatchByIdService(req.params.id);
    res.status(200).json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
};

const updateBatchByIdController = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.user?.id) data.updatedBy = req.user.id;
    const result = await updateBatchByIdService(req.params.id, data);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

const deleteBatchByIdController = async (req, res, next) => {
  try {
    const result = await deleteBatchByIdService(req.params.id);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Assign students controller
const assignStudentsController = async (req, res, next) => {
  try {
    const students = Array.isArray(req.body.students) ? req.body.students : [];
    const result = await assignStudentsToBatch(req.params.id, students);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Assign teacher controller
const assignTeacherController = async (req, res, next) => {
  try {
    const { teacher } = req.body;
    if (!teacher) {
      return res.status(400).json({ success: false, message: 'teacher id is required' });
    }
    const result = await assignTeacherToBatch(req.params.id, teacher);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Remove students controller
const removeStudentsController = async (req, res, next) => {
  try {
    const students = Array.isArray(req.body.students) ? req.body.students : [];
    const result = await removeStudentsFromBatch(req.params.id, students);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Remove teacher controller
const removeTeacherController = async (req, res, next) => {
  try {
    const result = await removeTeacherFromBatch(req.params.id);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Move students from one batch to another
const moveStudentsController = async (req, res, next) => {
  try {
    const fromBatchId = req.params.id;
    const { toBatchId, students } = req.body;

    if (!toBatchId) {
      return res.status(400).json({ success: false, message: 'toBatchId is required' });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'students array is required' });
    }

    const { moveStudentsBetweenBatches } = require('../services/batch.service');
    const result = await moveStudentsBetweenBatches(fromBatchId, toBatchId, students);
    res.status(200).json({ success: true, message: result.message, data: result.data });
  } catch (error) {
    next(error);
  }
};

// Final exports
module.exports = {
  createBatchController,
  getBatchesController,
  getBatchByIdController,
  updateBatchByIdController,
  deleteBatchByIdController,
  assignStudentsController,
  assignTeacherController,
  removeStudentsController,
  removeTeacherController,
  moveStudentsController
};
