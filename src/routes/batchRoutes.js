const express = require("express");
const BatchController = require("../controllers/batchController");  

const router = express.Router();


router.post("/new",BatchController.createBatch);
router.post("/add-student", BatchController.addStudentToBatch);
router.post("/remove-student", BatchController.removeStudentFromBatch);
router.post("/assign-teacher", BatchController.assignTeacherToBatch);
router.post("/remove-teacher", BatchController.removeTeacherFromBatch);
router.get("/:batchId", BatchController.getBatchById);
router.delete("/:batchId", BatchController.deleteBatchById);
router.get("/", BatchController.getAllBatches);

module.exports = router;