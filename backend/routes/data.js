const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { handleFileUpload } = require('../middleware/upload');
const {
  uploadDataset,
  getDatasets,
  getDataset,
  updateDataset,
  deleteDataset,
  getDatasetStats
} = require('../controllers/dataController');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Validation middleware
const datasetValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Dataset name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string')
];

// Routes
// @route   POST /api/data/upload
router.post('/upload', uploadLimiter, handleFileUpload, datasetValidation, uploadDataset);

// @route   GET /api/data
router.get('/', getDatasets);

// @route   GET /api/data/:id
router.get('/:id', getDataset);

// @route   PUT /api/data/:id
router.put('/:id', datasetValidation, updateDataset);

// @route   DELETE /api/data/:id
router.delete('/:id', deleteDataset);

// @route   GET /api/data/:id/stats
router.get('/:id/stats', getDatasetStats);

module.exports = router;
