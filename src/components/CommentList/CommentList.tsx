import CommentCard from '../CommentCard/CommentCard';
import { getCommentsCardByPostId, getCurrentUserId, insertCommnets } from '../../services/getData';
import { useEffect, useState } from 'react';
import { mapToCommentCard } from '../../mapper/mapToCommentCard';
import type { CommentCardData, CommnetToDb } from '../../types/comments';
import { supabase } from '../../lib/supabase';
import './CommentList.css';

interface CommentListProps {
    currentUserAvatar: string,
    postId: string | undefined
}

export default function CommentList({
    currentUserAvatar,
    postId
}: CommentListProps) {
    const [commentCards, setCommentCards] = useState<CommentCardData[] | []>([]);
    const [commentEvent, setCommentEvent] = useState<object | null>(null);

    function initFormSubmit() {
        const commentContainer = document.querySelector(".post-detail-comments");
        commentContainer?.addEventListener('keydown', (event) => {
            const e = event as KeyboardEvent
            if (e.key === 'Enter') {
                const currentInput = (event.target as HTMLElement).closest('input');
                if (currentInput?.classList.contains("post-comments")) {
                    const comment: CommnetToDb = {
                        content: currentInput.value,
                        author_id: "",
                        post_id: postId,
                        parent_id: null,
                        image: null
                    }

                    getCurrentUserId()
                        .then((userInfo) => {
                            if (userInfo != undefined) {
                                comment.author_id = userInfo.user.id;
                                insertCommnets(comment)
                            }
                            else
                                console.warn("Current user is undefined !");
                        })

                }
                else {
                    console.log("đây là comment con");
                }

                if(currentInput != undefined)
                    currentInput.value = '';
            }

        })
    }

    function removeInputDefaultBehavior() {
        const forms = document.querySelectorAll("form");
        forms.forEach((form) => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
            })
        })
    }

    // Init comments changes table listener 
    useEffect(() => {
        const commentChanges = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                },
                (payload) => {
                    console.log(payload);
                    setCommentEvent(payload);
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(commentChanges);
        }


    }, [])

    // Render comments data
    useEffect(() => {
        if (postId != undefined) {
            getCommentsCardByPostId(postId)
                .then((data: any[] | undefined) => {
                    if (data != undefined) {
                        const filteredData = data.map(r => mapToCommentCard(r));
                        setCommentCards(filteredData);
                    }
                });
        }

        removeInputDefaultBehavior();

        initFormSubmit();

    }, [postId, commentEvent])

    return (
        <div id='commnets' className="post-detail-comments">
            <h1 className='roboto-500'>Comments</h1>
            <div className="post-detail-comments--userinput">
                <img src={currentUserAvatar} width="50px" height="50px" alt="" />
                <form action=""><input className='post-comments roboto-300' type="text" placeholder='Thêm bình luận' /></form>
            </div>
            <div className="post-detail-comments--list">
                {
                    commentCards.length > 0 && commentCards.reverse().map((card) => {
                        return (
                            <CommentCard
                                key={card.id}
                                content={card.content}
                                username={card.user.name}
                                useravatar={card.user.avatarUrl}
                                created_at={card.createdAt}
                                likes={card.likes}
                                canReply={card.canReply}
                                imageurl={card.imageUrl}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}