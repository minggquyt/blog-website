import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { getPostsData } from '../../services/getData';
import PostCard from '../PostCard/PostCard.tsx';
import type { Posts } from '../../types/index.ts';
import './PostListByTags.css'

export default function PostListByTags() {
    const { tagSlug } = useParams();
    const [posts, setPosts] = useState<Posts>([]);

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
                    posts.length > 0 ?
                        posts.map(post => {
                            return <PostCard
                                key={post.id}
                                postId = {post.id}
                                postAuthorAvatar = {post.author.avatar}
                                postAuthorName = {post.author.name}
                                postCreateTime = {post.createdAt}
                                postTitle = {post.title}
                                postRoles = {post.roles}
                                postTotalReacts = {post.totalReacts}
                                postTotalComments = {post.commentsCount}
                                postTotalSave = {post.numberBookmarked}
                                postAuthorId = {post.author.id}
                                />
                        })
                        : (
                            <div>Chưa có data</div>
                        )
                }
            </div>
        </>
    )
}