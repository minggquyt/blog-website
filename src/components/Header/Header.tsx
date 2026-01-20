import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UserMenu from '../Auth/UserMenu'
import { NavLink } from 'react-router-dom'
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

    const handleCreatePost = () => {
        navigate('/create-post')
    }

    return (
        <div className="header">
            <div className="header__leftcontent">
                <h1 className='roboto-500' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Logo</h1>
                <form action="">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                    <input className='inter-300' placeholder="Search..." type="text" />
                </form>
            </div>
            <div className="header__rightcontent">
                <span className="material-symbols-outlined menubar">
                    menu
                </span>
                <NavLink to="/">
                    <span className="material-symbols-outlined">
                        home
                    </span>
                </NavLink>
                {user ? (
                    <>
                        <button
                            onClick={handleCreatePost}
                            className='roboto-400 create-post-btn'
                            title="Tạo bài viết"
                        >
                            <span className="material-symbols-outlined">
                                edit_square
                            </span>
                            <span className='createpost-text'>Viết bài</span>
                        </button>
                        <UserMenu onOpenProfile={onOpenProfile} />
                    </>
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