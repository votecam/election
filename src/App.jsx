import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/app/auth/Login'
import ForgotPassword from './components/app/auth/ForgotPassword'
import EmailConfirmation from './components/app/auth/EmailConfirmation'
import EnterOtp from './components/app/auth/EnterOtp'
import ResetPassword from './components/app/auth/ResetPassword'
import PasswordResetSuccess from './components/app/auth/PasswordResetSuccess'
import Profile from './components/app/profile/Profile'
import Layout from './components/app/dashboard/Layout'
import Dashboard from './components/app/dashboard/Dashboard'
import RegisterCentre from './components/app/centres/RegisterCentre'
import UploadCentre from './components/app/centres/UploadCentre'
import ManageCentre from './components/app/centres/ManageCentre'
import RegisterCandidate from './components/app/candidates/RegisterCandidate'
import ManageCandidate from './components/app/candidates/ManageCandidate'
import Analytics from './components/app/analytics/Analytics'
import Feedback from './components/app/feedback/Feedback'

import UploadGuide from './components/app/guides/UploadGuide'
import ManageGuide from './components/app/guides/ManageGuide'
import Settings from './components/app/settings/Settings'

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
          <Route path="/EnterOtp" element={<EnterOtp />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

          {/* Dashboard Routes - Nested under Layout */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            
            {/* Profile Route */}
            <Route path="profile" element={<Profile />} />
            
            {/* Settings Route */}
            <Route path="settings" element={<Settings />} />
            
            {/* Auth Routes (Protected) */}
            <Route path="auth">
              {/* Removed profile route from here */}
            </Route>
            
            {/* Centres Routes */}
            <Route path="centres">
              <Route index element={<Navigate to="/app/centres/register" replace />} />
              <Route path="register" element={<RegisterCentre />} />
              <Route path="upload" element={<UploadCentre />} />
              <Route path="manage-polling" element={<ManageCentre />} />
            </Route>
            
            {/* Candidates Routes */}
            <Route path="candidates">
              <Route index element={<Navigate to="/app/candidates/register" replace />} />
              <Route path="register" element={<RegisterCandidate />} />
              <Route path="manage" element={<ManageCandidate />} />
            </Route>
            
            {/* Guides Routes */}
            <Route path="guides">
              <Route index element={<Navigate to="/app/guides/upload" replace />} />
              <Route path="upload" element={<UploadGuide />} />
              <Route path="manage" element={<ManageGuide />} />
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
