import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/app/auth/Login'
import ForgotPassword from './components/app/auth/ForgotPassword'
import EmailConfirmation from './components/app/auth/EmailConfirmation'

function App() {
  // Check if in production by looking at the NODE_ENV
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set the basename for the router in production
  const basename = isProduction ? '/election' : '';
  
  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/EmailConfirmation" element={<EmailConfirmation />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
