import { useState, useEffect } from 'react'
import type { PostFilter, PostList, Posts, Post } from '../../types'
import PostCard from '../PostCard/PostCard';
import { mapPostsToPostList } from '../../mapper/mapPostsToPostList';
import { getPostsData } from '../../services/getData'
import './PostList.css'

export default function PostList({
    type,
    value
}: PostFilter) {
    const [list, setList] = useState<PostList>([]);

    useEffect(() => {
        getPostsData()
            .then((posts: Posts) => {
                let filteredPostCard: Posts = [];
                if (type == "tag") {
                    if (value != 'home') {
                        // viết logic fetch data từ postCard
                        filteredPostCard = posts.filter((post: Post) => {
                            return post.roles.includes(value);
                        })
                    }
                    else{
                        filteredPostCard = posts;
                    }
                }
                else if (type == "author") {
                    filteredPostCard = posts.filter((post) => {
                        return post.author.id == value;
                    })
                }

                setList(mapPostsToPostList(filteredPostCard));
            })
    }, [type, value]);

    return (
        <div className="postlist">
            {
                list.map(card => {
                    return (
                        <PostCard
                            key={card.postId}
                            postId={card.postId}
                            postAuthorAvatar={card.postAuthorAvatar}
                            postAuthorName={card.postAuthorName}
                            postCreateTime={card.postCreateTime}
                            postTitle={card.postTitle}
                            postRoles={card.postRoles}
                            postTotalReacts={card.postTotalReacts}
                            postTotalComments={card.postTotalComments}
                            postTotalSave={card.postTotalSave}
                            postAuthorId={card.postAuthorId}
                        />
                    )
                })
            }
        </div>
    )
}