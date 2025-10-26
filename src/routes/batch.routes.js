const express = require('express');
const router = express.Router();
const {
  createBatchController,
  getBatchesController,
  getBatchByIdController,
  updateBatchByIdController,
  deleteBatchByIdController
} = require('../controllers/batch.controller');
const { assignStudentsController, assignTeacherController } = require('../controllers/batch.controller');

const { verifyToken, hasRole, hasPermission } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Protect all batch routes
router.use(verifyToken);
router.use(apiLimiter);

// Create batch (admin/principal/teacher depending on permissions)
router.post('/',
  hasRole('admin', 'principal', 'teacher'),
  hasPermission('batch', 'create'),
  createBatchController
);

// Read all batches
router.get('/',
  hasRole('admin', 'principal', 'teacher'),
  hasPermission('batch', 'read'),
  getBatchesController
);

// Read single batch
router.get('/:id',
  hasRole('admin', 'principal', 'teacher'),
  hasPermission('batch', 'read'),
  getBatchByIdController
);

// Update batch
router.put('/:id',
  hasRole('admin', 'principal', 'teacher'),
  hasPermission('batch', 'update'),
  updateBatchByIdController
);

// Assign students (replace students array)
router.post('/:id/assign-students',
  hasRole('admin', 'principal', 'teacher'),
  hasPermission('batch', 'update'),
  assignStudentsController
);

// Assign teacher
router.post('/:id/assign-teacher',
  hasRole('admin', 'principal'),
  hasPermission('batch', 'update'),
  assignTeacherController
);

// Delete batch
router.delete('/:id',
  hasRole('admin'),
  hasPermission('batch', 'delete'),
  deleteBatchByIdController
);

module.exports = router;
