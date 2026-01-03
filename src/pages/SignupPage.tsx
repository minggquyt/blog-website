import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../components/Auth/Auth.css'

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setLoading(false)
      return
    }
    
    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.')
      // Tự động chuyển về trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Đăng ký</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
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
            minLength={6}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        
        <p className="auth-toggle">
          Đã có tài khoản?{' '}
          <button 
            type="button" 
            onClick={() => navigate('/login')} 
            className="link-button"
          >
            Đăng nhập ngay
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

export default SignupPage