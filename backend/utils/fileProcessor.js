const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Process uploaded file and extract metadata
const processFile = async (datasetId, filePath, fileType) => {
  try {
    let data = [];
    let columns = [];

    if (fileType === 'csv') {
      // Process CSV file
      data = await processCSV(filePath);
    } else if (['xlsx', 'xls'].includes(fileType)) {
      // Process Excel file
      data = await processExcel(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    if (data.length === 0) {
      throw new Error('No data found in file');
    }

    // Extract column information
    columns = extractColumnInfo(data);

    // Generate insights
    const insights = generateBasicInsights(data, columns);

    return {
      columns,
      rowCount: data.length,
      columnCount: columns.length,
      insights
    };
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
};

// Process CSV file
const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Process Excel file
const processExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 2) {
      throw new Error('Excel file must have at least a header row and one data row');
    }

    // Convert array format to object format
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });
  } catch (error) {
    throw new Error(`Excel processing error: ${error.message}`);
  }
};

// Extract column information from data
const extractColumnInfo = (data) => {
  if (data.length === 0) return [];

  const firstRow = data[0];
  const columns = [];

  for (const [columnName, value] of Object.entries(firstRow)) {
    const columnInfo = {
      name: columnName,
      type: inferDataType(data, columnName),
      sampleValues: getSampleValues(data, columnName, 5)
    };
    columns.push(columnInfo);
  }

  return columns;
};

// Infer data type for a column
const inferDataType = (data, columnName) => {
  const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined);
  
  if (values.length === 0) return 'string';

  // Check if all values are numbers
  const allNumbers = values.every(val => {
    const num = Number(val);
    return !isNaN(num) && isFinite(num);
  });

  if (allNumbers) return 'number';

  // Check if all values are dates
  const allDates = values.every(val => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  });

  if (allDates) return 'date';

  // Check if all values are booleans
  const allBooleans = values.every(val => {
    const str = String(val).toLowerCase();
    return str === 'true' || str === 'false' || str === '1' || str === '0';
  });

  if (allBooleans) return 'boolean';

  return 'string';
};

// Get sample values for a column
const getSampleValues = (data, columnName, count) => {
  const values = data
    .map(row => row[columnName])
    .filter(val => val !== null && val !== undefined)
    .slice(0, count);
  
  return [...new Set(values)]; // Remove duplicates
};

// Generate basic insights from data
const generateBasicInsights = (data, columns) => {
  const insights = {
    summary: {
      totalRows: data.length,
      totalColumns: columns.length,
      missingValues: countMissingValues(data),
      duplicateRows: countDuplicateRows(data)
    },
    statistics: {
      numericColumns: [],
      categoricalColumns: []
    }
  };

  // Analyze numeric columns
  columns.forEach(column => {
    if (column.type === 'number') {
      const values = data.map(row => Number(row[column.name])).filter(val => !isNaN(val));
      if (values.length > 0) {
        insights.statistics.numericColumns.push({
          column: column.name,
          mean: calculateMean(values),
          median: calculateMedian(values),
          min: Math.min(...values),
          max: Math.max(...values),
          std: calculateStandardDeviation(values)
        });
      }
    } else if (column.type === 'string') {
      const values = data.map(row => row[column.name]).filter(val => val !== null && val !== undefined);
      if (values.length > 0) {
        const valueCounts = countValues(values);
        insights.statistics.categoricalColumns.push({
          column: column.name,
          uniqueValues: Object.keys(valueCounts).length,
          topValues: Object.entries(valueCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([value, count]) => ({ value, count }))
        });
      }
    }
  });

  return insights;
};

// Helper functions for statistics
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

const countDuplicateRows = (data) => {
  const seen = new Set();
  let duplicates = 0;
  
  data.forEach(row => {
    const rowString = JSON.stringify(row);
    if (seen.has(rowString)) {
      duplicates++;
    } else {
      seen.add(rowString);
    }
  });
  
  return duplicates;
};

const calculateMean = (values) => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateMedian = (values) => {
  const sorted = values.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

const calculateStandardDeviation = (values) => {
  const mean = calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = calculateMean(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
};

const countValues = (values) => {
  const counts = {};
  values.forEach(value => {
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
};

module.exports = {
  processFile
};
