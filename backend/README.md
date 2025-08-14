# DataWise AI Backend

A powerful Node.js + Express backend for the DataWise AI analytics dashboard, providing comprehensive data processing, AI insights, and visualization capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **File Upload & Processing** - Support for CSV and Excel files with automatic data type inference
- **AI-Powered Insights** - Automated generation of data insights, anomalies, trends, and correlations
- **Chart Data Generation** - Dynamic chart data for bar, line, pie, scatter, and area charts
- **Real-time Analytics** - Fast data processing and analysis
- **Data Export** - Export chart data in JSON and CSV formats

### Security Features
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Rate Limiting** - Protection against API abuse
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configurable cross-origin resource sharing
- **Helmet Security** - HTTP security headers

### Data Processing
- **CSV/Excel Support** - Automatic parsing and validation
- **Data Type Inference** - Automatic detection of string, number, date, and boolean types
- **Missing Data Detection** - Identification and reporting of data quality issues
- **Statistical Analysis** - Mean, median, standard deviation, correlations
- **Anomaly Detection** - Outlier identification using statistical methods

## 📁 Project Structure

```
backend/
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── dataController.js
│   ├── insightsController.js
│   └── chartsController.js
├── models/              # Database models
│   ├── User.js
│   ├── Dataset.js
│   └── Insight.js
├── routes/              # API routes
│   ├── auth.js
│   ├── data.js
│   ├── insights.js
│   └── charts.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── upload.js
├── utils/               # Utility functions
│   ├── fileProcessor.js
│   ├── aiProcessor.js
│   └── chartProcessor.js
├── server.js            # Main server file
├── package.json         # Dependencies
└── env.example          # Environment variables template
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/datawise-ai
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/change-password` - Change password

### Data Management
- `POST /api/data/upload` - Upload CSV/Excel file
- `GET /api/data` - List user's datasets
- `GET /api/data/:id` - Get specific dataset
- `PUT /api/data/:id` - Update dataset metadata
- `DELETE /api/data/:id` - Delete dataset
- `GET /api/data/:id/stats` - Get dataset statistics

### AI Insights
- `GET /api/insights/:datasetId` - Get insights for dataset
- `POST /api/insights/:datasetId/generate` - Generate new insights
- `GET /api/insights/:datasetId/summary` - Get insights summary
- `GET /api/insights/:datasetId/:insightId` - Get specific insight
- `PUT /api/insights/:datasetId/:insightId` - Update insight
- `DELETE /api/insights/:datasetId/:insightId` - Delete insight

### Charts & Visualization
- `GET /api/charts/:datasetId` - Get chart data
- `GET /api/charts/:datasetId/types` - Get available chart types
- `GET /api/charts/:datasetId/dashboard` - Get dashboard charts
- `GET /api/charts/:datasetId/export` - Export chart data

### Health Check
- `GET /api/health` - Server health status

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Authentication Flow

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123",
       "company": "Acme Corp"
     }'
   ```

2. **Login to get JWT token**
   ```bash
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

3. **Use token for authenticated requests**
   ```bash
   curl -X GET http://localhost:5000/api/users/me \
     -H "Authorization: Bearer <your-jwt-token>"
   ```

## 📁 File Upload

### Supported Formats
- **CSV** (.csv) - Comma-separated values
- **Excel** (.xlsx, .xls) - Microsoft Excel files

### Upload Example
```bash
curl -X POST http://localhost:5000/api/data/upload \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "file=@data.csv" \
  -F "name=Sales Data" \
  -F "description=Monthly sales data for 2024" \
  -F "tags=sales,monthly,2024"
```

### File Processing
- Automatic data type inference
- Column analysis and statistics
- Missing data detection
- Duplicate row identification
- Basic insights generation

## 🤖 AI Insights

The backend automatically generates various types of insights:

### Insight Types
- **Summary** - Data quality and size insights
- **Anomaly** - Outlier detection and analysis
- **Trend** - Time-series trend analysis
- **Correlation** - Variable relationship analysis
- **Prediction** - Simple forecasting based on trends
- **Recommendation** - Actionable recommendations

### Generate Insights Example
```bash
curl -X POST http://localhost:5000/api/insights/<datasetId>/generate \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "types": ["summary", "anomaly", "trend", "correlation"]
  }'
```

## 📈 Chart Data

### Supported Chart Types
- **Bar Charts** - Categorical data comparison
- **Line Charts** - Time-series data trends
- **Pie Charts** - Proportional data visualization
- **Scatter Plots** - Correlation analysis
- **Area Charts** - Cumulative data visualization
- **Summary Statistics** - Statistical overview

### Chart Data Example
```bash
curl -X GET "http://localhost:5000/api/charts/<datasetId>?chartType=bar&columns=category" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/datawise-ai |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `MAX_FILE_SIZE` | Maximum file upload size | 10MB |
| `UPLOAD_PATH` | File upload directory | ./uploads |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 15 minutes |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per hour

## 🧪 Testing

Run tests with Jest:
```bash
npm test
```

## 🚀 Deployment

### Production Setup

1. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datawise-ai
   JWT_SECRET=your-production-secret-key
   ```

2. **Install production dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t datawise-ai-backend .
docker run -p 5000:5000 datawise-ai-backend
```

## 🔍 Monitoring & Logging

The backend includes comprehensive logging:
- **Morgan** - HTTP request logging
- **Error tracking** - Detailed error logging
- **Performance monitoring** - Request timing and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

## 🔗 Integration with Frontend

This backend is designed to work seamlessly with the DataWise AI frontend. The frontend can:

1. **Authenticate users** using the JWT tokens
2. **Upload data files** for processing
3. **Fetch insights** and display them in the dashboard
4. **Generate charts** using the chart data endpoints
5. **Export data** in various formats

The API responses are structured to work directly with the frontend's chart components and data visualization libraries.

