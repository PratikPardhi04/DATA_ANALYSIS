const Dataset = require('../models/Dataset');
const { generateChartData } = require('../utils/chartProcessor');

// @desc    Get chart data for dataset
// @route   GET /api/charts/:datasetId
// @access  Private
const getChartData = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { chartType, columns, limit = 100 } = req.query;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id,
      status: 'completed'
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found or not ready'
      });
    }

    // Generate chart data
    const chartData = await generateChartData(
      datasetId,
      chartType,
      columns ? columns.split(',') : undefined,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: {
        chartType,
        columns: chartData.columns,
        data: chartData.data,
        metadata: {
          datasetName: dataset.name,
          rowCount: dataset.rowCount,
          columnCount: dataset.columnCount
        }
      }
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get available chart types for dataset
// @route   GET /api/charts/:datasetId/types
// @access  Private
const getAvailableChartTypes = async (req, res) => {
  try {
    const { datasetId } = req.params;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id,
      status: 'completed'
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found or not ready'
      });
    }

    // Determine available chart types based on data types
    const availableCharts = [];
    const numericColumns = dataset.columns.filter(col => col.type === 'number');
    const categoricalColumns = dataset.columns.filter(col => col.type === 'string');
    const dateColumns = dataset.columns.filter(col => col.type === 'date');

    // Bar charts - need categorical data
    if (categoricalColumns.length > 0) {
      availableCharts.push({
        type: 'bar',
        name: 'Bar Chart',
        description: 'Compare categories',
        suitableColumns: categoricalColumns.map(col => col.name)
      });
    }

    // Line charts - need numeric data with time series
    if (numericColumns.length > 0 && dateColumns.length > 0) {
      availableCharts.push({
        type: 'line',
        name: 'Line Chart',
        description: 'Show trends over time',
        suitableColumns: numericColumns.map(col => col.name)
      });
    }

    // Pie charts - need categorical data
    if (categoricalColumns.length > 0) {
      availableCharts.push({
        type: 'pie',
        name: 'Pie Chart',
        description: 'Show proportions',
        suitableColumns: categoricalColumns.map(col => col.name)
      });
    }

    // Scatter plots - need two numeric columns
    if (numericColumns.length >= 2) {
      availableCharts.push({
        type: 'scatter',
        name: 'Scatter Plot',
        description: 'Show correlation between variables',
        suitableColumns: numericColumns.map(col => col.name)
      });
    }

    // Area charts - need numeric data
    if (numericColumns.length > 0) {
      availableCharts.push({
        type: 'area',
        name: 'Area Chart',
        description: 'Show cumulative data',
        suitableColumns: numericColumns.map(col => col.name)
      });
    }

    res.json({
      success: true,
      data: {
        availableCharts,
        columns: dataset.columns,
        datasetInfo: {
          name: dataset.name,
          rowCount: dataset.rowCount,
          columnCount: dataset.columnCount
        }
      }
    });
  } catch (error) {
    console.error('Get chart types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get dashboard summary charts
// @route   GET /api/charts/:datasetId/dashboard
// @access  Private
const getDashboardCharts = async (req, res) => {
  try {
    const { datasetId } = req.params;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id,
      status: 'completed'
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found or not ready'
      });
    }

    // Generate multiple chart types for dashboard
    const dashboardCharts = [];

    // Get numeric columns for summary statistics
    const numericColumns = dataset.columns.filter(col => col.type === 'number');
    if (numericColumns.length > 0) {
      const summaryStats = await generateChartData(datasetId, 'summary', numericColumns.map(col => col.name), 10);
      dashboardCharts.push({
        type: 'summary',
        title: 'Summary Statistics',
        data: summaryStats
      });
    }

    // Get categorical columns for distribution
    const categoricalColumns = dataset.columns.filter(col => col.type === 'string');
    if (categoricalColumns.length > 0) {
      const distributionData = await generateChartData(datasetId, 'pie', [categoricalColumns[0].name], 10);
      dashboardCharts.push({
        type: 'distribution',
        title: 'Data Distribution',
        data: distributionData
      });
    }

    // Get time series if available
    const dateColumns = dataset.columns.filter(col => col.type === 'date');
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      const timeSeriesData = await generateChartData(datasetId, 'line', [dateColumns[0].name, numericColumns[0].name], 50);
      dashboardCharts.push({
        type: 'trend',
        title: 'Trend Analysis',
        data: timeSeriesData
      });
    }

    res.json({
      success: true,
      data: {
        charts: dashboardCharts,
        datasetInfo: {
          name: dataset.name,
          rowCount: dataset.rowCount,
          columnCount: dataset.columnCount,
          lastUpdated: dataset.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard charts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Export chart data
// @route   GET /api/charts/:datasetId/export
// @access  Private
const exportChartData = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const { chartType, columns, format = 'json' } = req.query;

    // Verify dataset belongs to user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user.id,
      status: 'completed'
    });

    if (!dataset) {
      return res.status(404).json({
        success: false,
        message: 'Dataset not found or not ready'
      });
    }

    // Generate chart data
    const chartData = await generateChartData(
      datasetId,
      chartType,
      columns ? columns.split(',') : undefined,
      1000 // Export more data
    );

    // Format response based on requested format
    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(chartData.data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${dataset.name}-${chartType}-data.csv"`);
      res.send(csvData);
    } else {
      // JSON format
      res.json({
        success: true,
        data: {
          chartType,
          columns: chartData.columns,
          data: chartData.data,
          metadata: {
            datasetName: dataset.name,
            exportDate: new Date().toISOString(),
            rowCount: chartData.data.length
          }
        }
      });
    }
  } catch (error) {
    console.error('Export chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

module.exports = {
  getChartData,
  getAvailableChartTypes,
  getDashboardCharts,
  exportChartData
};
