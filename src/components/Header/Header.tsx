import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UserMenu from '../Auth/UserMenu'
import './Header.css'

interface HeaderProps {
  onOpenProfile: () => void
}

export default function Header({ onOpenProfile }: HeaderProps) {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate('/login')
    }

    const handleSignup = () => {
        navigate('/signup')
    }

    return (
        <div className="header">
            <div className="header__leftcontent">
                <h1 className='roboto-500' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Logo</h1>
                <form action="">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                    <input className='inter-300'  placeholder="Search..." type="text" />
                </form>
            </div>
            <div className="header__rightcontent">
                {user ? (
                    <UserMenu onOpenProfile={onOpenProfile} />
                ) : (
                    <div className="auth-buttons">
                        <button 
                            onClick={handleLogin}
                            className='roboto-300 login-btn'
                        >
                            Login
                        </button>
                        <button 
                            onClick={handleSignup}
                            className='roboto-400 signup-btn'
                        >
                            Create account
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}