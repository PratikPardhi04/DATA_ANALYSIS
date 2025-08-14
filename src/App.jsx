import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './hooks/useAuth.jsx'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test" element={
              <div className="p-8">
                <h1 className="text-4xl font-bold text-green-600">Test Page</h1>
                <p className="text-xl mt-4">This is a test page!</p>
              </div>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
