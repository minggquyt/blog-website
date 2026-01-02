import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { getPostsData } from '../../services/getData';
import { NavLink } from 'react-router-dom';
import './PostListByTags.css'

export default function PostListByTags() {
    const { tagSlug } = useParams();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPostsData()
            .then((data) => {
                if (tagSlug) {
                    const matchedPosts = data.filter((post) => {
                        return post.roles.includes(tagSlug);
                    })
                    setPosts(matchedPosts);
                }
                else 
                    setPosts(data);
            })
            .catch(error => console.log(error));
    }, [tagSlug]);

    return (
        <>
            <div className="postlist">
                {
                    posts.length > 0 ? posts.map((post) => {
                        return (
                            <div key={post['id']} className="post-item">
                                <NavLink to={`/users/${post['author']['id']}`} className="post-item-header">
                                    <img src={post['author']['avatar']} width="50px" height="50px" alt="" />
                                    <div className="post-item-header--userinfo">
                                        <h3 className='post-item-header--username roboto-500' >{post['author']['name']}</h3>
                                        <p className='post-item-header--createtime roboto-300'>{post["createdAt"]}</p>
                                    </div>
                                </NavLink>
                                <div className="post-item-title">
                                    <h1 className='roboto-500' >{post['title']}</h1>
                                    <div className="post-item-tags inter-300">
                                        {post['roles'].map((role) => {
                                            return (
                                                <p  key={role}>#{role}</p>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="post-item-footer">
                                    <div className='post-item-footer-left roboto-300' >
                                        <div className="post-item-footer--react">
                                            <span className="material-symbols-outlined">
                                                mood
                                            </span>
                                            {post['totalReacts']}
                                        </div>
                                        <div className="post-item-footer--comment">
                                            <span className="material-symbols-outlined">
                                                mode_comment
                                            </span>
                                            {post['commentsCount']}
                                        </div>
                                    </div>
                                    <div className="post-item-footer--bookmark">
                                        <span className="material-symbols-outlined">
                                            bookmark
                                        </span>
                                        {post['numberBookmarked']}
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <div className='post-notfount roboto-500' >Chưa có data</div>
                }
            </div>
        </>
    )
}