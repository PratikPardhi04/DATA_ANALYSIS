const Insight = require('../models/Insight');
const Dataset = require('../models/Dataset');
const { generateInsights } = require('../utils/aiProcessor');

// @desc    Get insights for dataset
// @route   GET /api/insights/:datasetId
// @access  Private
const getInsights = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { type, category, limit = 20 } = req.query;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Build query
    const query = {
      dataset: datasetId,
      user: req.user.id,
      isActive: true
    };

    if (type) query.type = type;
    if (category) query.category = category;

    // Get insights
    const insights = await Insight.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: insights,
      count: insights.length
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Generate new insights for dataset
// @route   POST /api/insights/:datasetId/generate
// @access  Private
const generateNewInsights = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { types = ['summary', 'anomaly', 'trend'] } = req.body;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id,
      status: 'completed'
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found or not ready for analysis'
      });
    }

    // Generate insights asynchronously
    generateInsights(datasetId, req.user.id, types)
      .then(async (insights) => {
        console.log(`Generated ${insights.length} insights for dataset ${datasetId}`);
      })
      .catch(async (error) => {
        console.error('Insight generation error:', error);
      });

    res.json({
      success: true,
      message: 'Insight generation started. Check back in a few minutes.',
      data: {
        datasetId,
        requestedTypes: types
      }
    });
  } catch (error) {
    console.error('Generate insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during insight generation'
    });
  }
};

// @desc    Get insight by ID
// @route   GET /api/insights/:datasetId/:insightId
// @access  Private
const getInsight = async (req, res) => {
  try {
    const { datasetId, insightId } = req.params;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Get insight
    const insight = await Insight.findOne({
      _id: insightId,
      dataset: datasetId,
      user: req.user.id
    });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    res.json({
      success: true,
      data: insight
    });
  } catch (error) {
    console.error('Get insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update insight
// @route   PUT /api/insights/:datasetId/:insightId
// @access  Private
const updateInsight = async (req, res) => {
  try {
    const { datasetId, insightId } = req.params;
    const { title, description, tags, isActive } = req.body;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Update insight
    const insight = await Insight.findOneAndUpdate(
      {
        _id: insightId,
        dataset: datasetId,
        user: req.user.id
      },
      {
        title,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
        isActive
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    res.json({
      success: true,
      message: 'Insight updated successfully',
      data: insight
    });
  } catch (error) {
    console.error('Update insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during update'
    });
  }
};

// @desc    Delete insight
// @route   DELETE /api/insights/:datasetId/:insightId
// @access  Private
const deleteInsight = async (req, res) => {
  try {
    const { datasetId, insightId } = req.params;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Delete insight
    const insight = await Insight.findOneAndDelete({
      _id: insightId,
      dataset: datasetId,
      user: req.user.id
    });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Insight not found'
      });
    }

    res.json({
      success: true,
      message: 'Insight deleted successfully'
    });
  } catch (error) {
    console.error('Delete insight error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion'
    });
  }
};

// @desc    Get insights summary
// @route   GET /api/insights/:datasetId/summary
// @access  Private
const getInsightsSummary = async (req, res) => {
  try {
    const { datasetId } = req.params;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found'
      });
    }

    // Get insights summary
    const summary = await Insight.aggregate([
      {
        $match: {
          dataset: dataset._id,
          user: req.user.id,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' },
          insights: { $push: '$$ROOT' }
        }
      }
    ]);

    // Get recent insights
    const recentInsights = await Insight.find({
      dataset: datasetId,
      user: req.user.id,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title type confidence createdAt');

    res.json({
      success: true,
      data: {
        summary,
        recentInsights,
        totalInsights: recentInsights.length
      }
    });
  } catch (error) {
    console.error('Get insights summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getInsights,
  generateNewInsights,
  getInsight,
  updateInsight,
  deleteInsight,
  getInsightsSummary
};
