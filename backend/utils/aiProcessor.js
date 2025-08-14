const Insight = require('../models/Insight');
const Dataset = require('../models/Dataset');
const { processFile } = require('./fileProcessor');

// Generate AI insights for a dataset
const generateInsights = async (datasetId, userId, types = ['summary', 'anomaly', 'trend']) => {
  try {
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Process the file to get data
    const fileData = await processFile(datasetId, dataset.filePath, dataset.fileType);
    const insights = [];

    // Generate insights based on requested types
    for (const type of types) {
      const typeInsights = await generateInsightByType(dataset, fileData, type, userId);
      insights.push(...typeInsights);
    }

    // Save insights to database
    const savedInsights = await Insight.insertMany(insights);

    return savedInsights;
  } catch (error) {
    console.error('AI insight generation error:', error);
    throw error;
  }
};

// Generate insights by type
const generateInsightByType = async (dataset, fileData, type, userId) => {
  const insights = [];

  switch (type) {
    case 'summary':
      insights.push(...await generateSummaryInsights(dataset, fileData, userId));
      break;
    case 'anomaly':
      insights.push(...await generateAnomalyInsights(dataset, fileData, userId));
      break;
    case 'trend':
      insights.push(...await generateTrendInsights(dataset, fileData, userId));
      break;
    case 'correlation':
      insights.push(...await generateCorrelationInsights(dataset, fileData, userId));
      break;
    case 'prediction':
      insights.push(...await generatePredictionInsights(dataset, fileData, userId));
      break;
    case 'recommendation':
      insights.push(...await generateRecommendationInsights(dataset, fileData, userId));
      break;
  }

  return insights;
};

// Generate summary insights
const generateSummaryInsights = async (dataset, fileData, userId) => {
  const insights = [];
  const { data, columns } = fileData;

  // Data quality insights
  const missingValues = countMissingValues(data);
  const missingPercentage = (missingValues / (data.length * columns.length)) * 100;

  if (missingPercentage > 10) {
    insights.push({
      dataset: dataset._id,
      user: userId,
      type: 'summary',
      title: 'High Missing Data Detected',
      description: `${missingPercentage.toFixed(1)}% of your data contains missing values. Consider data cleaning strategies.`,
      confidence: 0.9,
      severity: missingPercentage > 20 ? 'high' : 'medium',
      category: 'data_quality',
      data: {
        columns: ['Missing Values', 'Total Values', 'Percentage'],
        values: [missingValues, data.length * columns.length, missingPercentage]
      },
      recommendations: [
        {
          action: 'Data Cleaning',
          description: 'Implement data imputation strategies for missing values',
          impact: 'high',
          effort: 'medium'
        }
      ],
      tags: ['data-quality', 'missing-values']
    });
  }

  // Dataset size insights
  if (data.length > 10000) {
    insights.push({
      dataset: dataset._id,
      user: userId,
      type: 'summary',
      title: 'Large Dataset Detected',
      description: `Your dataset contains ${data.length.toLocaleString()} rows, which is excellent for robust analysis.`,
      confidence: 0.95,
      severity: 'low',
      category: 'business_insight',
      data: {
        columns: ['Rows', 'Columns', 'Total Cells'],
        values: [data.length, columns.length, data.length * columns.length]
      },
      recommendations: [
        {
          action: 'Advanced Analytics',
          description: 'Consider using machine learning models for deeper insights',
          impact: 'high',
          effort: 'high'
        }
      ],
      tags: ['large-dataset', 'analytics-opportunity']
    });
  }

  return insights;
};

// Generate anomaly insights
const generateAnomalyInsights = async (dataset, fileData, userId) => {
  const insights = [];
  const { data, columns } = fileData;

  // Find numeric columns for anomaly detection
  const numericColumns = columns.filter(col => col.type === 'number');

  for (const column of numericColumns) {
    const values = data.map(row => Number(row[column.name])).filter(val => !isNaN(val));
    
    if (values.length < 10) continue; // Need sufficient data

    const mean = calculateMean(values);
    const std = calculateStandardDeviation(values);
    const threshold = 2; // 2 standard deviations

    // Find outliers
    const outliers = values.filter(val => Math.abs(val - mean) > threshold * std);

    if (outliers.length > 0) {
      const outlierPercentage = (outliers.length / values.length) * 100;
      
      insights.push({
        dataset: dataset._id,
        user: userId,
        type: 'anomaly',
        title: `Anomalies Detected in ${column.name}`,
        description: `Found ${outliers.length} outliers (${outlierPercentage.toFixed(1)}%) in ${column.name}. These may indicate data quality issues or interesting patterns.`,
        confidence: 0.85,
        severity: outlierPercentage > 5 ? 'high' : 'medium',
        category: 'data_quality',
        data: {
          columns: ['Value', 'Deviation from Mean'],
          values: outliers.map(val => [val, Math.abs(val - mean)])
        },
        recommendations: [
          {
            action: 'Investigate Outliers',
            description: 'Review these values to determine if they are errors or legitimate anomalies',
            impact: 'medium',
            effort: 'low'
          }
        ],
        tags: ['anomaly', 'outliers', column.name.toLowerCase()]
      });
    }
  }

  return insights;
};

// Generate trend insights
const generateTrendInsights = async (dataset, fileData, userId) => {
  const insights = [];
  const { data, columns } = fileData;

  // Find date columns for trend analysis
  const dateColumns = columns.filter(col => col.type === 'date');
  const numericColumns = columns.filter(col => col.type === 'number');

  if (dateColumns.length === 0 || numericColumns.length === 0) {
    return insights;
  }

  const dateColumn = dateColumns[0];
  const numericColumn = numericColumns[0];

  // Sort data by date
  const sortedData = data
    .filter(row => row[dateColumn.name] && row[numericColumn.name])
    .sort((a, b) => new Date(a[dateColumn.name]) - new Date(b[dateColumn.name]));

  if (sortedData.length < 5) return insights; // Need sufficient data

  // Calculate trend
  const values = sortedData.map(row => Number(row[numericColumn.name]));
  const trend = calculateTrend(values);

  if (Math.abs(trend) > 0.1) { // Significant trend
    const trendDirection = trend > 0 ? 'increasing' : 'decreasing';
    
    insights.push({
      dataset: dataset._id,
      user: userId,
      type: 'trend',
      title: `${trendDirection.charAt(0).toUpperCase() + trendDirection.slice(1)} Trend Detected`,
      description: `${numericColumn.name} shows a ${trendDirection} trend over time. This could indicate important business patterns.`,
      confidence: 0.8,
      severity: 'medium',
      category: 'trend_analysis',
      data: {
        columns: [dateColumn.name, numericColumn.name],
        values: sortedData.map(row => [row[dateColumn.name], row[numericColumn.name]])
      },
      recommendations: [
        {
          action: 'Monitor Trend',
          description: 'Continue tracking this trend to understand its business impact',
          impact: 'medium',
          effort: 'low'
        }
      ],
      tags: ['trend', 'time-series', numericColumn.name.toLowerCase()]
    });
  }

  return insights;
};

// Generate correlation insights
const generateCorrelationInsights = async (dataset, fileData, userId) => {
  const insights = [];
  const { data, columns } = fileData;

  const numericColumns = columns.filter(col => col.type === 'number');

  if (numericColumns.length < 2) return insights;

  // Calculate correlations between numeric columns
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i];
      const col2 = numericColumns[j];

      const values1 = data.map(row => Number(row[col1.name])).filter(val => !isNaN(val));
      const values2 = data.map(row => Number(row[col2.name])).filter(val => !isNaN(val));

      if (values1.length < 10 || values2.length < 10) continue;

      const correlation = calculateCorrelation(values1, values2);

      if (Math.abs(correlation) > 0.7) { // Strong correlation
        const correlationType = correlation > 0 ? 'positive' : 'negative';
        
        insights.push({
          dataset: dataset._id,
          user: userId,
          type: 'correlation',
          title: `Strong ${correlationType} correlation found`,
          description: `${col1.name} and ${col2.name} have a strong ${correlationType} correlation (${correlation.toFixed(2)}). This relationship could be valuable for analysis.`,
          confidence: 0.85,
          severity: 'medium',
          category: 'business_insight',
          data: {
            columns: [col1.name, col2.name],
            values: data.map(row => [row[col1.name], row[col2.name]]).slice(0, 50)
          },
          recommendations: [
            {
              action: 'Investigate Relationship',
              description: 'Explore why these variables are correlated and how to leverage this insight',
              impact: 'high',
              effort: 'medium'
            }
          ],
          tags: ['correlation', col1.name.toLowerCase(), col2.name.toLowerCase()]
        });
      }
    }
  }

  return insights;
};

// Generate prediction insights
const generatePredictionInsights = async (dataset, fileData, userId) => {
  const insights = [];
  const { data, columns } = fileData;

  // Simple prediction based on trends
  const numericColumns = columns.filter(col => col.type === 'number');
  const dateColumns = columns.filter(col => col.type === 'date');

  if (numericColumns.length > 0 && dateColumns.length > 0) {
    const numericColumn = numericColumns[0];
    const dateColumn = dateColumns[0];

    const sortedData = data
      .filter(row => row[dateColumn.name] && row[numericColumn.name])
      .sort((a, b) => new Date(a[dateColumn.name]) - new Date(b[dateColumn.name]));

    if (sortedData.length >= 10) {
      const values = sortedData.map(row => Number(row[numericColumn.name]));
      const trend = calculateTrend(values);
      
      if (Math.abs(trend) > 0.05) {
        const lastValue = values[values.length - 1];
        const predictedValue = lastValue + (trend * 3); // Predict 3 periods ahead

        insights.push({
          dataset: dataset._id,
          user: userId,
          type: 'prediction',
          title: `Prediction for ${numericColumn.name}`,
          description: `Based on current trends, ${numericColumn.name} is predicted to be ${predictedValue.toFixed(2)} in the next period.`,
          confidence: 0.7,
          severity: 'medium',
          category: 'business_insight',
          data: {
            columns: ['Current Value', 'Predicted Value', 'Trend'],
            values: [[lastValue, predictedValue, trend]]
          },
          recommendations: [
            {
              action: 'Validate Prediction',
              description: 'Use this prediction to inform business decisions, but validate with additional data',
              impact: 'high',
              effort: 'medium'
            }
          ],
          tags: ['prediction', 'forecasting', numericColumn.name.toLowerCase()]
        });
      }
    }
  }

  return insights;
};

// Generate recommendation insights
const generateRecommendationInsights = async (dataset, fileData, userId) => {
  const insights = [];
  const { data, columns } = fileData;

  // Data quality recommendations
  const missingValues = countMissingValues(data);
  const missingPercentage = (missingValues / (data.length * columns.length)) * 100;

  if (missingPercentage > 5) {
    insights.push({
      dataset: dataset._id,
      user: userId,
      type: 'recommendation',
      title: 'Improve Data Quality',
      description: 'Your dataset has missing values that could affect analysis accuracy.',
      confidence: 0.9,
      severity: 'medium',
      category: 'data_quality',
      data: {
        columns: ['Missing Values', 'Percentage'],
        values: [missingValues, missingPercentage]
      },
      recommendations: [
        {
          action: 'Data Cleaning',
          description: 'Implement data validation and cleaning procedures',
          impact: 'high',
          effort: 'medium'
        },
        {
          action: 'Data Collection',
          description: 'Improve data collection processes to reduce missing values',
          impact: 'high',
          effort: 'high'
        }
      ],
      tags: ['data-quality', 'recommendations']
    });
  }

  // Analysis recommendations
  if (data.length > 1000) {
    insights.push({
      dataset: dataset._id,
      user: userId,
      type: 'recommendation',
      title: 'Advanced Analytics Opportunity',
      description: 'Your dataset size supports advanced analytics and machine learning.',
      confidence: 0.8,
      severity: 'low',
      category: 'business_insight',
      data: {
        columns: ['Dataset Size', 'Analytics Level'],
        values: [data.length, 'Advanced']
      },
      recommendations: [
        {
          action: 'Machine Learning',
          description: 'Consider implementing ML models for predictive analytics',
          impact: 'high',
          effort: 'high'
        },
        {
          action: 'Real-time Analytics',
          description: 'Set up real-time data processing for immediate insights',
          impact: 'medium',
          effort: 'medium'
        }
      ],
      tags: ['advanced-analytics', 'machine-learning']
    });
  }

  return insights;
};

// Helper functions
const calculateMean = (values) => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateStandardDeviation = (values) => {
  const mean = calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = calculateMean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
};

const calculateTrend = (values) => {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = values.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
};

const calculateCorrelation = (values1, values2) => {
  const n = Math.min(values1.length, values2.length);
  const mean1 = calculateMean(values1.slice(0, n));
  const mean2 = calculateMean(values2.slice(0, n));

  let numerator = 0;
  let denominator1 = 0;
  let denominator2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    numerator += diff1 * diff2;
    denominator1 += diff1 * diff1;
    denominator2 += diff2 * diff2;
  }

  return numerator / Math.sqrt(denominator1 * denominator2);
};

const countMissingValues = (data) => {
  let missingCount = 0;
  data.forEach(row => {
    Object.values(row).forEach(value => {
      if (value === null || value === undefined || value === '') {
        missingCount++;
      }
    });
  });
  return missingCount;
};

module.exports = {
  generateInsights
};
