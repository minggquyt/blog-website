import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../components/Auth/Auth.css'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Đăng nhập</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mật khẩu:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        
        <p className="auth-toggle">
          Chưa có tài khoản?{' '}
          <button 
            type="button" 
            onClick={() => navigate('/signup')} 
            className="link-button"
          >
            Đăng ký ngay
          </button>
        </p>
        
        <p className="auth-toggle">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="link-button"
          >
            Quay về trang chủ
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginPage