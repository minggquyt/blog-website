import { useState, useEffect } from 'react'
import type { PostFilter, PostList, Posts } from '../../types'
import PostCard from '../PostCard/PostCard';
import { mapPostsToPostList } from '../../mapper/mapPostsToPostList';
import { getPostsDataFromDatabase } from '../../services/getData'
import './PostList.css'

export default function PostList({
    type,
    value
}: PostFilter) {
    const [list, setList] = useState<PostList>([]);

    useEffect(() => {

        getPostsDataFromDatabase()
            .then((posts) => {
                let filteredPostCard: Posts = [];
                if (type == "tag" && posts != undefined) {
                    if (value != 'home') {
                        filteredPostCard = posts.filter(post => {
                            return post.tags.includes(value);
                        });
                    }
                    else {
                        filteredPostCard = posts;
                    }
                }
                else if (type == "author" && posts != undefined) {
                    filteredPostCard = posts.filter((post) => {
                        return post.author.id == value;
                    })
                }
                else{
                    console.warn("Lỗi trong quá trình Fetch Post Data");
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