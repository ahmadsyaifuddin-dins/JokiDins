const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getHistory,
  createIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/pendapatanController');

// GET /api/pendapatan/history
router.get('/history', protect, admin, getHistory);

// POST /api/pendapatan
router.post('/', protect, admin, createIncome);

// PUT /api/pendapatan/:id
router.put('/:id', protect, admin, updateIncome);

// DELETE /api/pendapatan/:id
router.delete('/:id', protect, admin, deleteIncome);

module.exports = router;
