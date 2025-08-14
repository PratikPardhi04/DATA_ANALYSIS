const { processFile } = require('./fileProcessor');
const Dataset = require('../models/Dataset');

// Generate chart data for different chart types
const generateChartData = async (datasetId, chartType, columns, limit = 100) => {
  try {
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Process the file to get data
    const fileData = await processFile(datasetId, dataset.filePath, dataset.fileType);
    const { data } = fileData;

    // Limit data for performance
    const limitedData = data.slice(0, limit);

    switch (chartType) {
      case 'bar':
        return generateBarChartData(limitedData, columns);
      case 'line':
        return generateLineChartData(limitedData, columns);
      case 'pie':
        return generatePieChartData(limitedData, columns);
      case 'scatter':
        return generateScatterChartData(limitedData, columns);
      case 'area':
        return generateAreaChartData(limitedData, columns);
      case 'summary':
        return generateSummaryChartData(limitedData, columns);
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  } catch (error) {
    console.error('Chart data generation error:', error);
    throw error;
  }
};

// Generate bar chart data
const generateBarChartData = (data, columns) => {
  if (!columns || columns.length === 0) {
    // Use first categorical column if no columns specified
    const categoricalColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && !values.every(val => !isNaN(Number(val)));
      }) : [];
    
    if (categoricalColumns.length === 0) {
      throw new Error('No suitable categorical columns found for bar chart');
    }
    columns = [categoricalColumns[0]];
  }

  const column = columns[0];
  const valueCounts = {};

  data.forEach(row => {
    const value = row[column] || 'Unknown';
    valueCounts[value] = (valueCounts[value] || 0) + 1;
  });

  const chartData = Object.entries(valueCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20) // Limit to top 20 categories
    .map(([name, value]) => ({ name, value }));

  return {
    columns: ['name', 'value'],
    data: chartData
  };
};

// Generate line chart data
const generateLineChartData = (data, columns) => {
  if (!columns || columns.length < 2) {
    // Try to find date and numeric columns
    const dateColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && values.every(val => !isNaN(new Date(val).getTime()));
      }) : [];
    
    const numericColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && values.every(val => !isNaN(Number(val)));
      }) : [];

    if (dateColumns.length === 0 || numericColumns.length === 0) {
      throw new Error('Line chart requires at least one date column and one numeric column');
    }
    columns = [dateColumns[0], numericColumns[0]];
  }

  const [dateColumn, valueColumn] = columns;

  // Sort by date
  const sortedData = data
    .filter(row => row[dateColumn] && row[valueColumn])
    .sort((a, b) => new Date(a[dateColumn]) - new Date(b[dateColumn]));

  const chartData = sortedData.map(row => ({
    date: row[dateColumn],
    value: Number(row[valueColumn])
  }));

  return {
    columns: ['date', 'value'],
    data: chartData
  };
};

// Generate pie chart data
const generatePieChartData = (data, columns) => {
  if (!columns || columns.length === 0) {
    // Use first categorical column if no columns specified
    const categoricalColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && !values.every(val => !isNaN(Number(val)));
      }) : [];
    
    if (categoricalColumns.length === 0) {
      throw new Error('No suitable categorical columns found for pie chart');
    }
    columns = [categoricalColumns[0]];
  }

  const column = columns[0];
  const valueCounts = {};

  data.forEach(row => {
    const value = row[column] || 'Unknown';
    valueCounts[value] = (valueCounts[value] || 0) + 1;
  });

  const chartData = Object.entries(valueCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10) // Limit to top 10 categories
    .map(([name, value]) => ({ name, value }));

  return {
    columns: ['name', 'value'],
    data: chartData
  };
};

// Generate scatter chart data
const generateScatterChartData = (data, columns) => {
  if (!columns || columns.length < 2) {
    // Try to find two numeric columns
    const numericColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && values.every(val => !isNaN(Number(val)));
      }) : [];

    if (numericColumns.length < 2) {
      throw new Error('Scatter chart requires at least two numeric columns');
    }
    columns = numericColumns.slice(0, 2);
  }

  const [xColumn, yColumn] = columns;

  const chartData = data
    .filter(row => row[xColumn] && row[yColumn])
    .map(row => ({
      x: Number(row[xColumn]),
      y: Number(row[yColumn])
    }));

  return {
    columns: ['x', 'y'],
    data: chartData
  };
};

// Generate area chart data
const generateAreaChartData = (data, columns) => {
  if (!columns || columns.length < 2) {
    // Try to find date and numeric columns
    const dateColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && values.every(val => !isNaN(new Date(val).getTime()));
      }) : [];
    
    const numericColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && values.every(val => !isNaN(Number(val)));
      }) : [];

    if (dateColumns.length === 0 || numericColumns.length === 0) {
      throw new Error('Area chart requires at least one date column and one numeric column');
    }
    columns = [dateColumns[0], numericColumns[0]];
  }

  const [dateColumn, valueColumn] = columns;

  // Sort by date
  const sortedData = data
    .filter(row => row[dateColumn] && row[valueColumn])
    .sort((a, b) => new Date(a[dateColumn]) - new Date(b[dateColumn]));

  // Calculate cumulative values
  let cumulative = 0;
  const chartData = sortedData.map(row => {
    cumulative += Number(row[valueColumn]);
    return {
      date: row[dateColumn],
      value: Number(row[valueColumn]),
      cumulative: cumulative
    };
  });

  return {
    columns: ['date', 'value', 'cumulative'],
    data: chartData
  };
};

// Generate summary chart data
const generateSummaryChartData = (data, columns) => {
  if (!columns || columns.length === 0) {
    // Use all numeric columns if no columns specified
    const numericColumns = data.length > 0 ? 
      Object.keys(data[0]).filter(key => {
        const values = data.map(row => row[key]).filter(val => val !== null && val !== undefined);
        return values.length > 0 && values.every(val => !isNaN(Number(val)));
      }) : [];
    
    if (numericColumns.length === 0) {
      throw new Error('No numeric columns found for summary statistics');
    }
    columns = numericColumns;
  }

  const summaryData = columns.map(column => {
    const values = data
      .map(row => Number(row[column]))
      .filter(val => !isNaN(val));

    if (values.length === 0) {
      return {
        column,
        count: 0,
        mean: 0,
        median: 0,
        min: 0,
        max: 0,
        std: 0
      };
    }

    const sorted = values.sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const std = Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length);

    return {
      column,
      count: values.length,
      mean: parseFloat(mean.toFixed(2)),
      median: parseFloat(median.toFixed(2)),
      min: Math.min(...values),
      max: Math.max(...values),
      std: parseFloat(std.toFixed(2))
    };
  });

  return {
    columns: ['column', 'count', 'mean', 'median', 'min', 'max', 'std'],
    data: summaryData
  };
};

// Get available chart types for a dataset
const getAvailableChartTypes = (columns) => {
  const availableCharts = [];
  const numericColumns = columns.filter(col => col.type === 'number');
  const categoricalColumns = columns.filter(col => col.type === 'string');
  const dateColumns = columns.filter(col => col.type === 'date');

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

  // Summary charts - need numeric data
  if (numericColumns.length > 0) {
    availableCharts.push({
      type: 'summary',
      name: 'Summary Statistics',
      description: 'Show statistical summary',
      suitableColumns: numericColumns.map(col => col.name)
    });
  }

  return availableCharts;
};

module.exports = {
  generateChartData,
  getAvailableChartTypes
};
