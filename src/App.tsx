import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header/Header'
import Homepage from "./components/Homepage/Hompage"
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreatePostPage from './pages/CreatePostPage'
import Profile from './components/Auth/Profile'

function App() {
  const [showProfile, setShowProfile] = useState(false)

  const handleOpenProfile = () => {
    setShowProfile(true)
  }

  const handleCloseProfile = () => {
    setShowProfile(false)
  }

  return (
    <AuthProvider>
      <div className="app">
        <Header onOpenProfile={handleOpenProfile} />
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/*" element={<Homepage />} />
        </Routes>
        
        {showProfile && (
          <div 
            onClick={handleCloseProfile} 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <Profile />
            </div>
          </div>
        )}
      </div>
    </AuthProvider>
  )
}

export default App
