import { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

interface AuthModalProps {
  onClose: () => void
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="auth-modal" onClick={handleOverlayClick}>
      <div className="modal-overlay">
        {isLogin ? (
          <Login onToggleMode={toggleMode} onSuccess={onClose} />
        ) : (
          <Signup onToggleMode={toggleMode} onSuccess={onClose} />
        )}
      </div>
    </div>
  )
}

export default AuthModal