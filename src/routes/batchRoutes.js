const express = require("express");
const BatchController = require("../controllers/batchController");
const AuthMiddleware = require("../config/auth");

const router = express.Router();

router.post("/new", AuthMiddleware.authenticate, BatchController.createBatch);
router.post(
  "/add-student",
  AuthMiddleware.authenticate,
  BatchController.addStudentToBatch
);
router.post(
  "/remove-student",
  AuthMiddleware.authenticate,
  BatchController.removeStudentFromBatch
);
router.post(
  "/assign-teacher",
  AuthMiddleware.authenticate,
  BatchController.assignTeacherToBatch
);
router.post(
  "/remove-teacher",
  AuthMiddleware.authenticate,
  BatchController.removeTeacherFromBatch
);
router.get(
  "/:batchId",
  AuthMiddleware.authenticate,
  BatchController.getBatchById
);
router.delete(
  "/:batchId",
  AuthMiddleware.authenticate,
  BatchController.deleteBatchById
);
router.get("/", AuthMiddleware.authenticate, BatchController.getAllBatches);
router.get(
  "/:batchId/teacher/:teacherId/students",
  AuthMiddleware.authenticate,
  BatchController.getAllStudentsByBatchAndTeacher
);

module.exports = router;
