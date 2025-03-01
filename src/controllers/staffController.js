const { createStaff } = require("../services/staff-service");

const addStaff = async (req, res) => {
  const staffData = req.body;
  const result = await createStaff(staffData);

  if (result.success) {
    return res.status(201).json({
      message: "Staff added successfully!",
      data: result.data,
    });
  } else {
    return res.status(500).json({
      message: "Error adding staff",
      error: result.error,
    });
  }
};

module.exports = { addStaff };
