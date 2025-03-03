const BatchService = require("../services/batch-service");

const BatchController ={

    createBatch:async(req,res)=>{
        try{
            const batchData = req.body
            const result = await BatchService.createBatch(batchData)
            res
            .status(201)
            .json({message:"Batch added successfully!",data:result});
        }
        catch(error){
            res
            .status(500)
            .json({message:"Error adding batch",error:error.message});
        }
    },
    addStudentToBatch: async (req, res) => {
        try {
          const { batchId, studentId } = req.body;
          const batch = await BatchService.addStudentToBatch(batchId, studentId);
          res.status(200).json({ success: true, batch });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
    
      // Remove a student from a batch
      removeStudentFromBatch: async (req, res) => {
        try {
          const { batchId, studentId } = req.body;
          const batch = await BatchService.removeStudentFromBatch(batchId, studentId);
          res.status(200).json({ success: true, batch });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
    
      // Assign a teacher to a batch
      assignTeacherToBatch: async (req, res) => {
        try {
          const { batchId, teacherId } = req.body;
          const batch = await BatchService.assignTeacherToBatch(batchId, teacherId);
          res.status(200).json({ success: true, batch });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
    
      // Remove a teacher from a batch
      removeTeacherFromBatch: async (req, res) => {
        try {
          const { batchId } = req.body;
          const batch = await BatchService.removeTeacherFromBatch(batchId);
          res.status(200).json({ success: true, batch });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },
      getBatchById: async (req, res) => {
        try {
            const { batchId } = req.params; // Get batchId from URL
            const batch = await BatchService.getBatchById(batchId);
            res.status(200).json({ success: true, batch });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    },

    // ✅ Delete Batch by ID
    deleteBatchById: async (req, res) => {
        try {
            const { batchId } = req.params; // Get batchId from URL
            await BatchService.deleteBatchById(batchId);
            res.status(200).json({ success: true, message: "Batch deleted successfully" });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    getAllBatches: async (req, res) => {
        try {
            let { sort = "createdAt", order = "asc", offset = 0, limit = 10 } = req.query;

            // Convert `offset` and `limit` to integers
            offset = parseInt(offset, 10);
            limit = parseInt(limit, 10);

            // Convert `order` to 1 (ascending) or -1 (descending)
            sort = { [sort]: order === "desc" ? -1 : 1 };

            const result = await BatchService.getAllBatches({ sort, offset, limit });
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = BatchController;