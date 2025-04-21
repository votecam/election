import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/app/auth/Login'
import ForgotPassword from './components/app/auth/ForgotPassword'
import EmailConfirmation from './components/app/auth/EmailConfirmation'
import Layout from './components/app/dashboard/Layout'
import Dashboard from './components/app/dashboard/Dashboard'
import RegisterCentre from './components/app/centres/RegisterCentre'
import UploadCentre from './components/app/centres/UploadCentre'
import ManageCentre from './components/app/centres/ManageCentre'
import Analytics from './components/app/analytics/Analytics'
import Feedback from './components/app/feedback/Feedback'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Root path shows login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/EmailConfirmation" element={<EmailConfirmation />} />
          
          {/* Dashboard Routes - Nested under Layout */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            
            {/* Centres Routes */}
            <Route path="centres">
              <Route index element={<Navigate to="/app/centres/register" replace />} />
              <Route path="register" element={<RegisterCentre />} />
              <Route path="upload" element={<UploadCentre />} />
              <Route path="manage-polling" element={<ManageCentre />} />
            </Route>
            
            {/* Feedback Route */}
            <Route path="feedback" element={<Feedback />} />
            
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
