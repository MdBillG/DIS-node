const Batch = require('../models/batch');
const { AppError } = require('../utils/errorHandler');

const createBatchService = async (batchData) => {
  try {
    // Basic uniqueness check: no two batches with same name
    const existing = await Batch.findOne({ name: batchData.name.trim() });
    if (existing) throw new AppError(400, 'Batch with this name already exists');

    const batch = await Batch.create(batchData);
    return { success: true, status: 201, message: 'Batch created successfully', data: batch };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(v => v.message);
      throw new AppError(400, messages.join(', '));
    }
    throw error;
  }
};

const getBatchesService = async (filter = {}) => {
  try {
    const batches = await Batch.find(filter)
      .populate({ path: 'teacher', select: 'fullName email roleName' })
      .populate({ path: 'students', select: 'fullName email roleName' })
      .lean();
    return { success: true, count: batches.length, data: batches };
  } catch (error) {
    throw new AppError(500, 'Error fetching batches', false, error);
  }
};

const getBatchByIdService = async (id) => {
  try {
    const batch = await Batch.findById(id)
      .populate({ path: 'teacher', select: 'fullName email roleName' })
      .populate({ path: 'students', select: 'fullName email roleName' });
    if (!batch) throw new AppError(404, 'Batch not found');
    return { success: true, data: batch };
  } catch (error) {
    throw error;
  }
};

const updateBatchByIdService = async (id, updateData) => {
  try {
    const batch = await Batch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate({ path: 'teacher', select: 'fullName email roleName' })
      .populate({ path: 'students', select: 'fullName email roleName' });
    if (!batch) throw new AppError(404, 'Batch not found');
    return { success: true, message: 'Batch updated successfully', data: batch };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(v => v.message);
      throw new AppError(400, messages.join(', '));
    }
    throw error;
  }
};

const deleteBatchByIdService = async (id) => {
  try {
    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) throw new AppError(404, 'Batch not found');
    return { success: true, message: 'Batch deleted successfully', data: batch };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBatchService,
  getBatchesService,
  getBatchByIdService,
  updateBatchByIdService,
  deleteBatchByIdService
};

// Assign students to a batch (replace current students array)
const assignStudentsToBatch = async (id, students = []) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      id,
      { students },
      { new: true, runValidators: true }
    )
      .populate({ path: 'teacher', select: 'fullName email roleName' })
      .populate({ path: 'students', select: 'fullName email roleName' });

    if (!batch) throw new AppError(404, 'Batch not found');
    return { success: true, message: 'Students assigned to batch', data: batch };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(v => v.message);
      throw new AppError(400, messages.join(', '));
    }
    throw error;
  }
};

// Assign or change teacher for a batch
const assignTeacherToBatch = async (id, teacherId) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      id,
      { teacher: teacherId },
      { new: true, runValidators: true }
    )
      .populate({ path: 'teacher', select: 'fullName email roleName' })
      .populate({ path: 'students', select: 'fullName email roleName' });

    if (!batch) throw new AppError(404, 'Batch not found');
    return { success: true, message: 'Teacher assigned to batch', data: batch };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(v => v.message);
      throw new AppError(400, messages.join(', '));
    }
    throw error;
  }
};

module.exports = {
  createBatchService,
  getBatchesService,
  getBatchByIdService,
  updateBatchByIdService,
  deleteBatchByIdService,
  assignStudentsToBatch,
  assignTeacherToBatch
};
