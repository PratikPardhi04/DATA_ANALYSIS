const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getInsights,
  generateNewInsights,
  getInsight,
  updateInsight,
  deleteInsight,
  getInsightsSummary
} = require('../controllers/insightsController');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation middleware
const insightValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

const generateInsightsValidation = [
  body('types')
    .optional()
    .isArray()
    .withMessage('Types must be an array'),
  body('types.*')
    .optional()
    .isIn(['summary', 'anomaly', 'trend', 'correlation', 'prediction', 'recommendation'])
    .withMessage('Invalid insight type')
];

// Routes
// @route   GET /api/insights/:datasetId
router.get('/:datasetId', getInsights);

// @route   POST /api/insights/:datasetId/generate
router.post('/:datasetId/generate', generateInsightsValidation, generateNewInsights);

// @route   GET /api/insights/:datasetId/summary
router.get('/:datasetId/summary', getInsightsSummary);

// @route   GET /api/insights/:datasetId/:insightId
router.get('/:datasetId/:insightId', getInsight);

// @route   PUT /api/insights/:datasetId/:insightId
router.put('/:datasetId/:insightId', insightValidation, updateInsight);

// @route   DELETE /api/insights/:datasetId/:insightId
router.delete('/:datasetId/:insightId', deleteInsight);

module.exports = router;
