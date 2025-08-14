import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { dataAPI } from '../api/api.jsx'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  FileSpreadsheet,
  Database,
  Cloud,
  RefreshCw,
  Trash2
} from 'lucide-react'

const DataUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [datasets, setDatasets] = useState([])
  const [loadingDatasets, setLoadingDatasets] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDatasets()
  }, [])

  const loadDatasets = async () => {
    try {
      setLoadingDatasets(true)
      const response = await dataAPI.getDatasets()
      setDatasets(response.datasets || [])
    } catch (err) {
      console.error('Failed to load datasets:', err)
      setError('Failed to load existing datasets')
    } finally {
      setLoadingDatasets(false)
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    newFiles.forEach(fileObj => {
      uploadFile(fileObj)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
      'text/plain': ['.txt']
    },
    multiple: true
  })

  const uploadFile = async (fileObj) => {
    try {
      setUploadProgress(prev => ({ ...prev, [fileObj.id]: 0 }))
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        )
      )

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min((prev[fileObj.id] || 0) + Math.random() * 15, 90)
          return { ...prev, [fileObj.id]: newProgress }
        })
      }, 200)

      const response = await dataAPI.uploadDataset(fileObj.file, '')
      
      clearInterval(progressInterval)
      setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }))
      
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                status: 'completed', 
                progress: 100, 
                datasetId: response.dataset._id,
                dataset: response.dataset
              }
            : f
        )
      )

      await loadDatasets()

    } catch (err) {
      console.error('Upload failed:', err)
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'error', error: err.message }
            : f
        )
      )
      setError(err.message)
    }
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
  }

  const deleteDataset = async (datasetId) => {
    try {
      await dataAPI.deleteDataset(datasetId)
      await loadDatasets()
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete dataset')
    }
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'csv':
        return <FileSpreadsheet className="w-6 h-6 text-blue-500" />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />
      case 'json':
        return <Database className="w-6 h-6 text-purple-500" />
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Upload & Processing</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Upload your data files and let our AI analyze them for insights.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            or click to select files
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports CSV, Excel, JSON, and TXT files up to 10MB
          </p>
        </div>
      </Card>

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Uploading Files ({uploadedFiles.length})
            </h2>
            
            {uploadedFiles.map((fileObj) => (
              <motion.div
                key={fileObj.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(fileObj.file.name)}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {fileObj.file.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(fileObj.file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {fileObj.status === 'pending' && (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                    
                    {fileObj.status === 'uploading' && (
                      <div className="flex items-center space-x-2 text-blue-500">
                        <Cloud className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                    
                    {fileObj.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                    
                    {fileObj.status === 'error' && (
                      <div className="flex items-center space-x-2 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Error</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {fileObj.status === 'uploading' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[fileObj.id] || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(uploadProgress[fileObj.id] || 0)}% complete
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Datasets ({datasets.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadDatasets}
            loading={loadingDatasets}
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>

        {loadingDatasets ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-dark-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : datasets.length === 0 ? (
          <Card className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No datasets yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your first dataset to get started with AI insights.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
              <motion.div
                key={dataset._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(dataset.originalName)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDataset(dataset._id)}
                    icon={Trash2}
                    className="text-red-500 hover:text-red-700"
                  />
                </div>
                
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {dataset.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {dataset.originalName}
                </p>
                
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Rows:</span>
                    <span>{dataset.rowCount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Columns:</span>
                    <span>{dataset.columnCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(dataset.fileSize)}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Status: {dataset.status}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.location.href = `/dashboard?dataset=${dataset._id}`}
                    >
                      View Insights
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DataUpload
