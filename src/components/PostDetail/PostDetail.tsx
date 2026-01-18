import { NavLink, useLocation, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { PostDetailParams, Post, UserDetail } from '../../types';
import { getPostsDataWithIdFromDatabase, getPostsDataWithSlugFromDatabase, getUsersInfoWithIdFromDatabase } from '../../services/getData';
import { mapToUserDetail } from '../../mapper/mapToUserDetail';
import { mapToPostType } from '../../mapper/mapToPostType';
import CommentList from '../CommentList/CommentList';
import './PostDetail.css'

export default function PostDetail() {
    const { userId, postId } = useParams<PostDetailParams>();
    const [postData, setPostData] = useState<Post | undefined>(undefined);
    const [userInfo, setUserInfo] = useState<UserDetail | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation();

    useEffect(() => {
        if (postId != undefined) {
            // Clear existing data first to show loading state
            setPostData(undefined);
            setUserInfo(undefined);
            setIsLoading(true);
            
            const loadPostData = async () => {
                try {
                    // Try to get post by ID first, then by slug if ID fails
                    const getPostData = () => {
                        // If postId is numeric, try ID first, otherwise try slug first
                        const isNumeric = /^\d+$/.test(postId);
                        
                        if (isNumeric) {
                            return getPostsDataWithIdFromDatabase(postId)
                                .then(post => {
                                    if (!post) {
                                        // Fallback to slug query if ID fails
                                        return getPostsDataWithSlugFromDatabase(postId);
                                    }
                                    return post;
                                });
                        } else {
                            return getPostsDataWithSlugFromDatabase(postId)
                                .then(post => {
                                    if (!post) {
                                        // Fallback to ID query if slug fails
                                        return getPostsDataWithIdFromDatabase(postId);
                                    }
                                    return post;
                                });
                        }
                    };
                    
                    const post = await getPostData();
                    
                    if (post != undefined) {
                        const postFiltered = mapToPostType(post);
                        setPostData(postFiltered);
                        
                        // Get author info using userId from URL or post data
                        const userProfile = Array.isArray(post.user_profile) ? post.user_profile[0] : post.user_profile;
                        const authorId = userId || userProfile?.id;
                        if (authorId) {
                            const user = await getUsersInfoWithIdFromDatabase(authorId);
                            if (user != undefined) {
                                const userFiltered = mapToUserDetail(user);
                                setUserInfo(userFiltered);
                            }
                        }
                    }
                } catch (error: any) {
                    console.error('Error loading post data:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            
            loadPostData();
        }
    }, [userId, postId, location.state]); // Add location.state to dependency to trigger reload

    useEffect(() => {
        if (location.hash)
            document.querySelector(location.hash)?.scrollIntoView({ behavior: "smooth" });
    }, [postData, userInfo]);


    return (
        <div className="post-detail">
            {
                isLoading ? (
                    <div className="loading-container">
                        <div>Đang tải bài viết...</div>
                    </div>
                ) : postData && userInfo && postId ? (
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
                                        postData.tags?.map((tag) => {
                                            return (
                                                <p key={tag} className="roboto-300">
                                                    #{tag}
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="post-detail-content--body">
                                {
                                    postData.content?.map((paragraph, index) => {
                                        return (
                                            <p key={index} className="roboto-400">
                                                {paragraph.value}
                                            </p>
                                        )
                                    })
                                }
                            </div>
                            <CommentList
                                currentUserAvatar = {userInfo.basicInfo.avatar.url}
                                postId = {postId}
                            />
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
                ) : (
                    <div className="error-container">
                        <div>Không thể tải bài viết. Vui lòng thử lại sau.</div>
                    </div>
                )
            }

        </div>
    )
}