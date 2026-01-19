import { NavLink, useLocation, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { PostDetailParams, Post, UserDetail } from '../../types';
import { getPostsDataWithIdFromDatabase, getUsersInfoWithIdFromDatabase, getCurrentUserLogin } from '../../services/getData';
import { mapToUserDetail } from '../../mapper/mapToUserDetail';
import { mapToPostType } from '../../mapper/mapToPostType';
import CommentList from '../CommentList/CommentList';
import { supabase } from '../../lib/supabase';
import './PostDetail.css'

export default function PostDetail() {
    const { userId, postId } = useParams<PostDetailParams>();
    const [postData, setPostData] = useState<Post | undefined>(undefined);
    const [userInfo, setUserInfo] = useState<UserDetail | undefined>(undefined);
    const [currentUserLogin, setCurrentUserLogin] = useState<any | null>(null);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if ((event == 'INITIAL_SESSION' || event === 'SIGNED_OUT') && session == null)
                setIsLogin(false);
            else if ((event == 'INITIAL_SESSION' || event === 'SIGNED_IN') && session != null)
                setIsLogin(true);
        },)

        // call unsubscribe to remove the callback
        return () => {
            data.subscription.unsubscribe();
        }
    }, [])

    useEffect(() => {
        if (isLogin) {
            getCurrentUserLogin()
                .then(currentUser => {
                    currentUser != undefined && setCurrentUserLogin(currentUser);
                })
        }
        else
            setCurrentUserLogin(null);
    }, [isLogin])

    useEffect(() => {

        if (userId != undefined && postId != undefined) {
            Promise.all([getPostsDataWithIdFromDatabase(postId), getUsersInfoWithIdFromDatabase(userId)])
                .then(([post, user]) => {
                    if (post != undefined && user != undefined) {
                        const postFiltered = mapToPostType(post);
                        const userFiltered = mapToUserDetail(user);
                        setPostData(postFiltered);
                        setUserInfo(userFiltered);
                    }
                })
        }
    }, [userId, postId]);

    useEffect(() => {
        if (location.hash)
            document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" });
    }, [postData, userInfo, currentUserLogin]);

    return (
        <div className="post-detail">
            {
                postData && userInfo && postId && (
                    <>
                        <div className="post-detail-leftsidebar">
                            <div className='post-detail-leftsidebar--reaction'>
                                <span className="material-symbols-outlined">
                                    add_reaction
                                </span>
                                20
                            </div>
                            <div className="post-detail-leftsidebar--comment">
                                <span className="material-symbols-outlined">
                                    mode_comment
                                </span>
                                20
                            </div>
                            <div className="post-detail-leftsidebar--bookmark">
                                <span className="material-symbols-outlined">
                                    bookmark
                                </span>
                                20
                            </div>
                            <div className="post-detail-leftsidebar--reupload">
                                <span className="material-symbols-outlined">
                                    cached
                                </span>
                                20
                            </div>
                        </div>
                        <div className="post-detail-content">
                            <a className="post-detail-content--background" href={postData.background}>
                                <img src={postData.background} alt="" />
                            </a>
                            <NavLink to={`/users/${userInfo.id}`} className="post-detail-content--author">
                                <img src={userInfo?.basicInfo.avatar.url} width="50px" height="50px" alt="" className="post-detail-content--author_avatar" />
                                <div className="post-detail-content--authordesc">
                                    <h3 className='roboto-500'>{userInfo?.basicInfo.username}</h3>
                                    <p className='roboto-300'>Đăng ngày {postData.createdAt}</p>
                                </div>
                            </NavLink>
                            <div className="post-detail-content--title">
                                <h1 className='roboto-500'>{postData.title}</h1>
                                <div className="post-detail-content--title_tag">
                                    {
                                        postData.roles.map((role) => {
                                            return (
                                                <p key={role} className="roboto-300">
                                                    #{role}
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="post-detail-content--body">
                                {
                                    postData.content.map((paragraph) => {
                                        return (
                                            <p key={paragraph.id} className="roboto-400">
                                                {paragraph.value}
                                            </p>
                                        )
                                    })
                                }
                            </div>
                            {
                                isLogin && currentUserLogin != null ? (
                                    <CommentList
                                        currentLoginuserId={currentUserLogin.user.id}
                                        isCurrentUserLogin={isLogin}
                                        postId={postId}
                                    />
                                ) : (
                                    <CommentList
                                        currentLoginuserId={undefined}
                                        isCurrentUserLogin={isLogin}
                                        postId={postId}
                                    />
                                )
                            }
                        </div>
                        <div className="post-detail-author">
                            <a className="post-detail-author--background">
                                <img src={userInfo.background} alt="" />
                            </a>
                            <div>
                                <NavLink to={`/users/${userInfo.id}`} className="post-detail-author--info">
                                    <img src={userInfo?.basicInfo.avatar.url} width="80px" height="80px" alt="" />
                                    <h2 className='roboto-500'>{userInfo?.basicInfo.username}</h2>
                                </NavLink>
                                <button className='roboto-500' >Follow</button>
                                <NavLink to={`/users/${userInfo.id}`} className='roboto-300 post-detail-author--info_introduction'>
                                    {
                                        userInfo.introduction.items.map((item) => {
                                            return (
                                                <p key={item.id}>
                                                    <span className="material-symbols-outlined">
                                                        {item.icon}
                                                    </span>{item.value}
                                                </p>
                                            )
                                        })

                                    }
                                    {
                                        userInfo.statistics.items.map(item => {
                                            return (
                                                <p key={item.id} ><span className="material-symbols-outlined">
                                                    {item.icon}
                                                </span><span>{item.value}</span>{item.label}</p>
                                            )
                                        })
                                    }
                                </NavLink>
                            </div>
                        </div>
                    </>
                )
            }

        </div>
    )
}