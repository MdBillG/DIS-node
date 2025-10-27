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

const User = require('../models/user');

const assignStudentsToBatch = async (id, students = []) => {
  try {
    // Validate all student IDs exist and have roleName 'student'
    if (!Array.isArray(students) || students.length === 0) {
      throw new AppError(400, 'Students array must not be empty');
    }
    const foundStudents = await User.find({ _id: { $in: students }, roleName: 'student' });
    if (foundStudents.length !== students.length) {
      const foundIds = foundStudents.map(u => String(u._id));
      const missing = students.filter(id => !foundIds.includes(String(id)));
      throw new AppError(400, `Invalid student IDs: ${missing.join(', ')}`);
    }

    // Update batch's students array
    const batch = await Batch.findByIdAndUpdate(
      id,
      { students },
      { new: true, runValidators: true }
    )
      .populate({ path: 'teacher', select: 'fullName email roleName assignedBatch' })
      .populate({ path: 'students', select: 'fullName email roleName assignedBatch' });

    if (!batch) throw new AppError(404, 'Batch not found');

    // Remove batch from all users previously assigned to this batch but not in new students list
    await User.updateMany(
      { assignedBatch: batch._id },
      { $pull: { assignedBatch: batch._id } }
    );
    // Add batch to all newly assigned students
    await User.updateMany(
      { _id: { $in: students } },
      { $addToSet: { assignedBatch: batch._id } }
    );

    return { success: true, message: 'Students assigned to batch', data: batch };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(v => v.message);
      throw new AppError(400, messages.join(', '));
    }
    throw error;
  }
};

const assignTeacherToBatch = async (id, teacherId) => {
  try {
    // Validate teacher exists and has roleName 'teacher'
    const teacher = await User.findOne({ _id: teacherId, roleName: 'teacher' });
    if (!teacher) {
      throw new AppError(400, `Invalid teacher ID: ${teacherId}`);
    }

    // Update batch's teacher
    const batch = await Batch.findByIdAndUpdate(
      id,
      { teacher: teacherId },
      { new: true, runValidators: true }
    )
      .populate({ path: 'teacher', select: 'fullName email roleName assignedBatch' })
      .populate({ path: 'students', select: 'fullName email roleName assignedBatch' });

    if (!batch) throw new AppError(404, 'Batch not found');

    // Remove batch from all users who previously had this batch assigned as teacher
    await User.updateMany(
      { assignedBatch: batch._id, roleName: 'teacher', _id: { $ne: teacherId } },
      { $pull: { assignedBatch: batch._id } }
    );
    // Add batch to the assigned teacher
    await User.updateOne(
      { _id: teacherId },
      { $addToSet: { assignedBatch: batch._id } }
    );

    return { success: true, message: 'Teacher assigned to batch', data: batch };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(v => v.message);
      throw new AppError(400, messages.join(', '));
    }
    throw error;
  }
};

// Remove specific students from a batch
const removeStudentsFromBatch = async (id, students = []) => {
  try {
    if (!Array.isArray(students) || students.length === 0) {
      throw new AppError(400, 'Students array must not be empty');
    }

    const batch = await Batch.findById(id);
    if (!batch) throw new AppError(404, 'Batch not found');

    // Pull provided students from batch.students
    await Batch.updateOne({ _id: id }, { $pull: { students: { $in: students } } });

    // Remove batch from those users' assignedBatch
    await User.updateMany({ _id: { $in: students } }, { $pull: { assignedBatch: batch._id } });

    // Return updated batch populated
    const updated = await Batch.findById(id)
      .populate({ path: 'teacher', select: 'fullName email roleName assignedBatch' })
      .populate({ path: 'students', select: 'fullName email roleName assignedBatch' });

    return { success: true, message: 'Students removed from batch', data: updated };
  } catch (error) {
    throw error;
  }
};

// Remove teacher assignment from a batch
const removeTeacherFromBatch = async (id) => {
  try {
    const batch = await Batch.findById(id);
    if (!batch) throw new AppError(404, 'Batch not found');

    const previousTeacherId = batch.teacher;

    // Set teacher to null
    await Batch.updateOne({ _id: id }, { $unset: { teacher: '' } });

    // Remove batch from previous teacher's assignedBatch
    if (previousTeacherId) {
      await User.updateMany({ _id: previousTeacherId }, { $pull: { assignedBatch: batch._id } });
    }

    const updated = await Batch.findById(id)
      .populate({ path: 'teacher', select: 'fullName email roleName assignedBatch' })
      .populate({ path: 'students', select: 'fullName email roleName assignedBatch' });

    return { success: true, message: 'Teacher removed from batch', data: updated };
  } catch (error) {
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

module.exports.removeStudentsFromBatch = removeStudentsFromBatch;
module.exports.removeTeacherFromBatch = removeTeacherFromBatch;
