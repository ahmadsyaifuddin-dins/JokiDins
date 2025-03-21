// controllers/activityController.js
const Activity = require("../models/Activity");

const getUserActivity = async (req, res) => {
  try {
    // Misal, untuk mengambil aktivitas berdasarkan id user yang ada di req.params.id
    const activities = await Activity.find({ user: req.params.id }).sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserActivity };
