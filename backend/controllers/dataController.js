const Dataset = require('../models/Dataset');
const { processFile } = require('../utils/fileProcessor');
const fs = require('fs').promises;
const path = require('path');

// @desc    Upload dataset
// @route   POST /api/data/upload
// @access  Private
const uploadDataset = async (req, res) => {
  try {
    const { name, description, tags } = req.body;
    const { fileInfo } = req;

    // Create dataset record
    const dataset = await Dataset.create({
      name: name || path.basename(fileInfo.originalName, path.extname(fileInfo.originalName)),
      description,
      user: req.user.id,
      fileName: fileInfo.fileName,
      originalName: fileInfo.originalName,
      filePath: fileInfo.filePath,
      fileSize: fileInfo.fileSize,
      fileType: fileInfo.fileType,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      status: 'processing'
    });

    // Process file asynchronously
    processFile(dataset._id, fileInfo.filePath, fileInfo.fileType)
      .then(async (result) => {
        // Update dataset with processing results
        await Dataset.findByIdAndUpdate(dataset._id, {
          status: 'completed',
          columns: result.columns,
          rowCount: result.rowCount,
          columnCount: result.columnCount,
          insights: result.insights
        });
      })
      .catch(async (error) => {
        console.error('File processing error:', error);
        await Dataset.findByIdAndUpdate(dataset._id, {
          status: 'error',
          processingError: error.message
        });
      });

    res.status(201).json({
      success: true,
      message: 'Dataset uploaded successfully. Processing in progress.',
      data: {
        id: dataset._id,
        name: dataset.name,
        status: dataset.status
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
};

// @desc    Get all datasets for user
// @route   GET /api/data
// @access  Private
const getDatasets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: req.user.id };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get datasets with pagination
    const datasets = await Dataset.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-filePath');

    // Get total count
    const total = await Dataset.countDocuments(query);

    res.json({
      success: true,
      data: datasets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single dataset
// @route   GET /api/data/:id
// @access  Private
const getDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Update last accessed
    await dataset.updateLastAccessed();

    res.json({
      success: true,
      data: dataset
    });
  } catch (error) {
    console.error('Get dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update dataset
// @route   PUT /api/data/:id
// @access  Private
const updateDataset = async (req, res) => {
  try {
    const { name, description, tags, isPublic } = req.body;

    const dataset = await Dataset.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        name,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
        isPublic
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    res.json({
      success: true,
      message: 'Dataset updated successfully',
      data: dataset
    });
  } catch (error) {
    console.error('Update dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during update'
    });
  }
};

// @desc    Delete dataset
// @route   DELETE /api/data/:id
// @access  Private
const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(dataset.filePath);
    } catch (fileError) {
      console.error('File deletion error:', fileError);
    }

    // Delete dataset from database
    await Dataset.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Dataset deleted successfully'
    });
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion'
    });
  }
};

// @desc    Get dataset statistics
// @route   GET /api/data/:id/stats
// @access  Private
const getDatasetStats = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    res.json({
      success: true,
      data: dataset.getStatistics()
    });
  } catch (error) {
    console.error('Get dataset stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  uploadDataset,
  getDatasets,
  getDataset,
  updateDataset,
  deleteDataset,
  getDatasetStats
};
