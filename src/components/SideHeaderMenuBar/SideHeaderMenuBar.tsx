import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { NavLink } from 'react-router-dom'
import UserMenu from '../Auth/UserMenu'
import './SideHeaderMenuBar.css';

interface SideHeaderMenuBarProps {
    setStateFunction: Function;
    handleCreatePost: Function;
    onOpenProfile: () => void;
    handleLogin: Function;
    handleSignup: Function
}

export default function SideHeaderMenuBar({
    setStateFunction,
    handleCreatePost,
    onOpenProfile,
    handleLogin,
    handleSignup
}: SideHeaderMenuBarProps) {
    const menuRef = useRef(null);
    const { user } = useAuth()

    useEffect(() => {
        function handleOnClickOnDocument() {
            setStateFunction();
        }
        
        document.addEventListener('click', handleOnClickOnDocument);

        if(menuRef.current != null){
            (menuRef.current as HTMLElement).classList.add("active");
        } 

        return () => {
            document.removeEventListener('click', handleOnClickOnDocument);
        }

    }, [])
    return (
        <>
            <div className='menu--pseudolayer'>

            </div>
            <div ref={menuRef} className="menu--leftsidebar">
                <NavLink className="roboto-500" to="/">
                    <span className="material-symbols-outlined">
                        home
                    </span>
                    Home
                </NavLink>
                {user ? (
                    <>
                        <button
                            onClick={() => handleCreatePost()}
                            className='roboto-400 create-post-menubarbtn'
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
                    <div className="auth-menu_buttons">
                        <div
                            onClick={() => handleLogin()}
                            className='roboto-300 login-menubtn'
                        >
                            <span className="material-symbols-outlined">
                                login
                            </span>
                            <span>Login</span>
                        </div>
                        <div
                            onClick={() => handleSignup()}
                            className='roboto-400 signup-menubtn'
                        >
                            <span className="material-symbols-outlined">
                                add
                            </span>
                            <span>Create account</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}