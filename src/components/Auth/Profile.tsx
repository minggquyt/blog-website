import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './Auth.css'

const Profile = () => {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="profile-container roboto-500">
      <div className="profile-card">
        <h2>Thông tin tài khoản</h2>
        
        <div className="profile-info">
          <div className="info-group">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          
          <div className="info-group">
            <label>ID:</label>
            <span>{user.id}</span>
          </div>
          
          <div className="info-group">
            <label>Ngày tạo:</label>
            <span>{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut} 
          disabled={loading}
          className="signout-button"
        >
          {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  )
}

export default Profile