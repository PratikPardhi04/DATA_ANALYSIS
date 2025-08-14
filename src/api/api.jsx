// API helper for DataWise AI backend integration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('datawise_token');
};

// Helper to set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('datawise_token', token);
  } else {
    localStorage.removeItem('datawise_token');
  }
};

// Helper to get user data from localStorage
const getUserData = () => {
  const userData = localStorage.getItem('datawise_user');
  return userData ? JSON.parse(userData) : null;
};

// Helper to set user data in localStorage
const setUserData = (userData) => {
  if (userData) {
    localStorage.setItem('datawise_user', JSON.stringify(userData));
  } else {
    localStorage.removeItem('datawise_user');
  }
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      setAuthToken(null);
      setUserData(null);
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setAuthToken(response.token);
      setUserData(response.user);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
      setUserData(response.user);
    }
    
    return response;
  },

  // Get current user profile
  getProfile: async () => {
    return await apiRequest('/users/me');
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    if (response.user) {
      setUserData(response.user);
    }
    
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiRequest('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout (clear local storage)
  logout: () => {
    setAuthToken(null);
    setUserData(null);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get current user data
  getCurrentUser: () => {
    return getUserData();
  },
};

// Data API calls
export const dataAPI = {
  // Upload dataset
  uploadDataset: async (file, description = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/data/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    
    return data;
  },

  // Get all datasets
  getDatasets: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    
    return await apiRequest(`/data?${params}`);
  },

  // Get single dataset
  getDataset: async (datasetId) => {
    return await apiRequest(`/data/${datasetId}`);
  },

  // Update dataset
  updateDataset: async (datasetId, updateData) => {
    return await apiRequest(`/data/${datasetId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete dataset
  deleteDataset: async (datasetId) => {
    return await apiRequest(`/data/${datasetId}`, {
      method: 'DELETE',
    });
  },

  // Get dataset statistics
  getDatasetStats: async (datasetId) => {
    return await apiRequest(`/data/${datasetId}/stats`);
  },
};

// Insights API calls
export const insightsAPI = {
  // Get insights for dataset
  getInsights: async (datasetId, type = '', category = '') => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    
    return await apiRequest(`/insights/${datasetId}?${params}`);
  },

  // Generate new insights
  generateInsights: async (datasetId) => {
    return await apiRequest(`/insights/${datasetId}/generate`, {
      method: 'POST',
    });
  },

  // Get insights summary
  getInsightsSummary: async (datasetId) => {
    return await apiRequest(`/insights/${datasetId}/summary`);
  },

  // Get single insight
  getInsight: async (datasetId, insightId) => {
    return await apiRequest(`/insights/${datasetId}/${insightId}`);
  },

  // Update insight
  updateInsight: async (datasetId, insightId, updateData) => {
    return await apiRequest(`/insights/${datasetId}/${insightId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete insight
  deleteInsight: async (datasetId, insightId) => {
    return await apiRequest(`/insights/${datasetId}/${insightId}`, {
      method: 'DELETE',
    });
  },
};

// Charts API calls
export const chartsAPI = {
  // Get chart data
  getChartData: async (datasetId, chartType, options = {}) => {
    const params = new URLSearchParams({
      type: chartType,
      ...options,
    });
    
    return await apiRequest(`/charts/${datasetId}?${params}`);
  },

  // Get available chart types
  getAvailableChartTypes: async (datasetId) => {
    return await apiRequest(`/charts/${datasetId}/types`);
  },

  // Get dashboard charts
  getDashboardCharts: async (datasetId) => {
    return await apiRequest(`/charts/${datasetId}/dashboard`);
  },

  // Export chart data
  exportChartData: async (datasetId, chartType, format = 'json') => {
    const params = new URLSearchParams({
      type: chartType,
      format,
    });
    
    return await apiRequest(`/charts/${datasetId}/export?${params}`);
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    throw new Error('Backend server is not available');
  }
};

export default {
  auth: authAPI,
  data: dataAPI,
  insights: insightsAPI,
  charts: chartsAPI,
  healthCheck,
};
