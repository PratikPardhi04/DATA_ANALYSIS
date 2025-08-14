const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a dataset name'],
    trim: true,
    maxlength: [100, 'Dataset name cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    enum: ['csv', 'xlsx', 'xls'],
    required: true
  },
  columns: [{
    name: String,
    type: String, // 'string', 'number', 'date', 'boolean'
    sampleValues: [String]
  }],
  rowCount: {
    type: Number,
    default: 0
  },
  columnCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'error'],
    default: 'uploading'
  },
  processingError: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  metadata: {
    uploadDate: {
      type: Date,
      default: Date.now
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    accessCount: {
      type: Number,
      default: 0
    }
  },
  insights: {
    summary: {
      totalRows: Number,
      totalColumns: Number,
      missingValues: Number,
      duplicateRows: Number
    },
    statistics: {
      numericColumns: [{
        column: String,
        mean: Number,
        median: Number,
        min: Number,
        max: Number,
        std: Number
      }],
      categoricalColumns: [{
        column: String,
        uniqueValues: Number,
        topValues: [{
          value: String,
          count: Number
        }]
      }]
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
datasetSchema.index({ user: 1, createdAt: -1 });
datasetSchema.index({ status: 1 });
datasetSchema.index({ tags: 1 });

// Update last accessed timestamp
datasetSchema.methods.updateLastAccessed = function() {
  this.metadata.lastAccessed = new Date();
  this.metadata.accessCount += 1;
  return this.save();
};

// Get dataset statistics
datasetSchema.methods.getStatistics = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    fileType: this.fileType,
    rowCount: this.rowCount,
    columnCount: this.columnCount,
    status: this.status,
    uploadDate: this.metadata.uploadDate,
    lastAccessed: this.metadata.lastAccessed,
    accessCount: this.metadata.accessCount,
    insights: this.insights
  };
};

module.exports = mongoose.model('Dataset', datasetSchema);
