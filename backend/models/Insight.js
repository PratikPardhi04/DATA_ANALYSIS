const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['summary', 'anomaly', 'trend', 'correlation', 'prediction', 'recommendation'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['data_quality', 'business_insight', 'performance', 'security', 'trend_analysis'],
    required: true
  },
  data: {
    // Flexible schema for different types of insights
    columns: [String],
    values: mongoose.Schema.Types.Mixed,
    charts: [{
      type: {
        type: String,
        enum: ['bar', 'line', 'pie', 'scatter', 'heatmap']
      },
      data: mongoose.Schema.Types.Mixed,
      config: mongoose.Schema.Types.Mixed
    }],
    metrics: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
      change: mongoose.Schema.Types.Mixed
    }
  },
  recommendations: [{
    action: String,
    description: String,
    impact: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    effort: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
insightSchema.index({ dataset: 1, type: 1 });
insightSchema.index({ user: 1, createdAt: -1 });
insightSchema.index({ category: 1, severity: 1 });
insightSchema.index({ isActive: 1, expiresAt: 1 });

// Virtual for insight age
insightSchema.virtual('age').get(function() {
  return Date.now() - this.generatedAt.getTime();
});

// Method to check if insight is expired
insightSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Method to get insight summary
insightSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.type,
    title: this.title,
    description: this.description,
    confidence: this.confidence,
    severity: this.severity,
    category: this.category,
    generatedAt: this.generatedAt,
    isExpired: this.isExpired(),
    recommendationsCount: this.recommendations.length
  };
};

// Pre-save middleware to set expiration if not provided
insightSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    // Set expiration to 30 days from generation for most insights
    const expirationDays = this.type === 'prediction' ? 7 : 30;
    this.expiresAt = new Date(this.generatedAt.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  }
  next();
});

module.exports = mongoose.model('Insight', insightSchema);
