import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './Auth.css'

interface UserMenuProps {
  onOpenProfile: () => void
}

const UserMenu = ({ onOpenProfile }: UserMenuProps) => {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
    setIsOpen(false)
  }

  if (!user) return null

  return (
    <div className="user-menu">
      <button
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.email}
      </button>
      
      {isOpen && (
        <div className="user-menu-dropdown">
          <button
            className="user-menu-item"
            onClick={() => {
              onOpenProfile()
              setIsOpen(false)
            }}
          >
            Thông tin tài khoản
          </button>
          <button
            className="user-menu-item"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu