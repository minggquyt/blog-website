import { getCommentsCardByPostId, getCurrentLoginUserInfoById, insertCommnets } from '../../services/getData';
import { useEffect, useState } from 'react';
import type { CommentCardData, CommentToDb, CommentCardBuildTree } from '../../types/comments';
import { supabase } from '../../lib/supabase';
import CommentItem from '../CommentItem/CommentItem';
import CommentBox from '../CommentBox/CommentBox';
import './CommentList.css';

interface CommentListProps {
    currentLoginuserId: string | undefined,
    isCurrentUserLogin: boolean,
    postId: string | undefined
}

export default function CommentList({
    currentLoginuserId, 
    isCurrentUserLogin,
    postId
}: CommentListProps) {
    
    const [commentCards, setCommentCards] = useState<CommentCardBuildTree | []>([]);
    const [commentEvent, setCommentEvent] = useState<object | null>(null);
    const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
    const [currentUserLoginInfo, setCurrentUserLoginInfo] = useState<any | null>(null);

    // convert comments from database to hierarchy comments tree 
    function buildCommentTree(comments: CommentCardData[]) {
        const map = new Map();
        const roots: CommentCardBuildTree = [];

        comments.forEach(c => {
            // insert field children in each element
            map.set(c.id, { ...c, children: [] });
        });

        comments.forEach(c => {
            if (c.parent_id) {
                map.get(c.parent_id)?.children.push(map.get(c.id));
            } else {
                roots.push(map.get(c.id));
            }
        });

        return roots;
    }

    // handle onclick to display reply box 
    function handleReplyState(commentIdOnUpdate: string | null) {
        if(commentIdOnUpdate != null && commentIdOnUpdate != activeReplyCommentId){
            setActiveReplyCommentId(commentIdOnUpdate);
        }
        else if(commentIdOnUpdate != null && commentIdOnUpdate == activeReplyCommentId){
            setActiveReplyCommentId(null);
        }
        else if(commentIdOnUpdate == null){
            setActiveReplyCommentId(null);
        }
    }

    function initFormSubmit() {

        const commentContainer = document.querySelector(".post-detail-comments");
        commentContainer?.addEventListener('keydown', (event) => {
            const e = event as KeyboardEvent
            if (e.key === 'Enter') {
                const currentInput = (event.target as HTMLElement).closest('input');
                if (currentInput?.classList.contains("post-comments")) {
                    const comment: CommentToDb = {
                        content: currentInput.value,
                        author_id: "",
                        post_id: postId,
                        parent_id: null,
                        image: null
                    }

                    // validate empty string - vì sao component bị render 2 lần nếu không validate ? 
                    if (comment.content?.trim() != "" && currentLoginuserId != undefined) {
                        comment.author_id = currentLoginuserId
                        insertCommnets(comment);
                    }
                }
                else if (currentInput?.classList.contains('sub-comments')) {
                    console.log("đây là comment con");

                    // get Parent Comment Id
                    const parentComment = (event.target as HTMLElement).closest('.comment-card');
                    const parentCommentId = (parentComment as HTMLElement | undefined)?.dataset.id ?? null;


                    const comment: CommentToDb = {
                        content: currentInput.value,
                        author_id: "",
                        post_id: postId,
                        parent_id: parentCommentId, // lấy id của comment cha 
                        image: null
                    }

                    // validate empty string - vì sao component bị render 2 lần nếu không validate ? 
                    if (comment.content?.trim() != "" && currentLoginuserId != undefined) {
                        comment.author_id = currentLoginuserId
                        insertCommnets(comment);
                    }

                }

                if (currentInput != undefined)
                    currentInput.value = '';
            }
        })

    }

    // Init comments changes table listener 
    useEffect(() => {
        const commentChanges = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                },
                (payload) => {
                    console.log("comments table thay đổi !");
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
        if (postId !== undefined) {
            if (currentLoginuserId != undefined) {
                Promise.all([getCommentsCardByPostId(postId), getCurrentLoginUserInfoById(currentLoginuserId)])
                    .then(([commentsData, currentUserLoginData]) => {
                        if (commentsData != undefined) {
                            const buildedTree = buildCommentTree(commentsData);
                            setCommentCards(buildedTree);
                        }
                        currentUserLoginData != undefined && setCurrentUserLoginInfo(currentUserLoginData[0]);
                    })
            }
            else {
                getCommentsCardByPostId(postId)
                    .then((commentsData) => {
                        if (commentsData != undefined) {
                            const buildedTree = buildCommentTree(commentsData);
                            setCommentCards(buildedTree);
                        }
                        setCurrentUserLoginInfo(null);
                    })
            }

            setActiveReplyCommentId(null);

        }




        initFormSubmit();

    }, [postId, commentEvent, currentLoginuserId])

    return (
        <div id='commnets' className="post-detail-comments">
            <h1 className='roboto-500'>Comments</h1>
            {
                isCurrentUserLogin && currentUserLoginInfo && (
                    <>
                        <CommentBox userAvatar={currentUserLoginInfo.avatar_url} isReply={false} handleReplyState={null} />
                    </>
                )
            }
            <div className="post-detail-comments--list">
                {
                    commentCards.length > 0 ? commentCards.map((card) => {
                        return (
                            <CommentItem
                                key={card.id}
                                currentComment={card}
                                currentCommentUser={currentUserLoginInfo}
                                replyCommentId={activeReplyCommentId}
                                onReplyState={handleReplyState}
                                currentCommentLevel={Number(card.level)}
                            />
                        )
                    }) : (
                        <div className="post-detail-comments--list--nocommentinit">
                            <img src="/images/comments/no-comment.jpg" width="200px" alt="" />
                            <h1 className='roboto-500'>Chưa có bình luận nào</h1>
                            <div className='roboto-400'>Hãy là người bình luận đầu tiên</div>
                        </div>
                    )

                }
            </div>
        </div >
    )
}