const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getChartData,
  getAvailableChartTypes,
  getDashboardCharts,
  exportChartData
} = require('../controllers/chartsController');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes
// @route   GET /api/charts/:datasetId
router.get('/:datasetId', getChartData);

// @route   GET /api/charts/:datasetId/types
router.get('/:datasetId/types', getAvailableChartTypes);

// @route   GET /api/charts/:datasetId/dashboard
router.get('/:datasetId/dashboard', getDashboardCharts);

// @route   GET /api/charts/:datasetId/export
router.get('/:datasetId/export', exportChartData);

module.exports = router;
