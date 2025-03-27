const getUserActivity = async (req, res) => {
  try {
    // Ambil limit dan page dari query, default limit = 10 dan page = 1
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    // Query data dengan skip & limit
    const activities = await Activity.find({ user: req.params.id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
      
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserActivity };
