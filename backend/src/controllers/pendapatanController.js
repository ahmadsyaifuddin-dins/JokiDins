const Pendapatan = require('../models/Pendapatan');

const getHistory = async (req, res) => {
  try {
    const incomes = await Pendapatan.find({}).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createIncome = async (req, res) => {
  console.log('POST /api/pendapatan dipanggil, body:', req.body);
  const { nominal } = req.body;
  
  if (typeof nominal !== 'number' || isNaN(nominal)) {
    return res.status(400).json({ message: 'Invalid nominal value' });
  }
  
  try {
    const newIncome = await Pendapatan.create({
      nominal,
      date: new Date(),
    });
    res.status(200).json({
      message: 'Income recorded successfully',
      data: newIncome,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateIncome = async (req, res) => {
  const { nominal } = req.body;
  
  if (typeof nominal !== 'number' || isNaN(nominal)) {
    return res.status(400).json({ message: 'Invalid nominal value' });
  }
  
  try {
    const updatedIncome = await Pendapatan.findByIdAndUpdate(
      req.params.id,
      { nominal, date: new Date() },
      { new: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Income updated successfully', data: updatedIncome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Pendapatan.findByIdAndDelete(req.params.id);
    if (!deletedIncome) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getHistory,
  createIncome,
  updateIncome,
  deleteIncome,
};
