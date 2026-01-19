import CommentBox from '../CommentBox/CommentBox';
import { useState } from 'react';
import EditCommentBox from '../EditCommetBox/EditCommentBox';
import UpdateCommentsForm from '../UpdateCommentsForm/UpdateCommentsForm';
import './CommentCard.css';

interface CommentCardProps {
    commentCardId: string,
    content: string,
    username: string,
    useravatar: string,
    author_id: string,
    created_at: string,
    likes: number,
    canReply: boolean,
    imageurl: string | undefined,
    currentReplyUser: any,
    isDisplayReplyBox: boolean,
    handleReplyState: Function,
    marginleft: string
}

export default function CommentCard({
    commentCardId,
    content,
    username,
    useravatar,
    author_id,
    created_at,
    likes,
    canReply,
    imageurl,
    currentReplyUser,
    isDisplayReplyBox,
    handleReplyState,
    marginleft
}: CommentCardProps) {
    const [isDisplayEditCommentBox, setIsDisplayEditCommentBox] = useState<boolean>(false);
    const [isUpdateComment, setIsUpdateComment] = useState<boolean>(false);

    function handleClickUpdateComment(value: boolean){
        console.log('Bạn click vào update !');
        setIsUpdateComment(value);
    }

    function handleClick(e: React.MouseEvent<HTMLSpanElement>) {
        e.stopPropagation();
        const toggleValue = !isDisplayEditCommentBox;
        setIsDisplayEditCommentBox(toggleValue);
    }

    return (
        <>
            <div style={{ marginLeft: `${marginleft}` }} data-id={commentCardId} className="comment-card">
                <div className="comment-card-header">
                    <div className='comment-card-header--userinfo'>
                        <img src={useravatar} width="50px" height="50px" alt="" />
                        <div>
                            <h3 className='roboto-500' >{username}</h3>
                            <p className='roboto-300'>{created_at}</p>
                        </div>
                    </div>
                    <span onClick={(e: React.MouseEvent<HTMLSpanElement>) => handleClick(e)} className="material-symbols-outlined">
                        more_horiz
                    </span>
                    {
                        isDisplayEditCommentBox && (
                            <EditCommentBox onClickHandler={handleClick} isSameUser={author_id == currentReplyUser?.id} onClickUpdateButtonHandler={handleClickUpdateComment} />
                        )
                    }
                </div>
                {
                    !isUpdateComment ? (
                        <div className="comment-card-body">
                            {
                                imageurl && <img src={imageurl} width="200px" alt="" />

                            }
                            <p className='comment-card-body--content roboto-400'>{content}
                            </p>
                            <div className="comment-card-body--reaction">
                                <div className='comment-card-body--reaction--likes'>
                                    <span className="material-symbols-outlined">
                                        add_reaction
                                    </span>
                                    <p className='roboto-300'>{likes} likes</p>
                                </div>
                                <div className='comment-card-body--reaction--reply'>
                                    {
                                        canReply && (
                                            <>
                                                <span onClick={(e) => {
                                                    e.preventDefault();
                                                    handleReplyState(commentCardId)
                                                }} className="material-symbols-outlined">
                                                    mode_comment
                                                </span>
                                                <p onClick={(e) => {
                                                    e.preventDefault();
                                                    handleReplyState(commentCardId);
                                                }} className='roboto-300'>Reply</p>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                       <>
                        <UpdateCommentsForm  onClickUpdateCommentHandler={handleClickUpdateComment} />
                       </>
                    )
                }

                {
                    isDisplayReplyBox && currentReplyUser != null && (
                        <CommentBox userAvatar={currentReplyUser.avatar_url} isReply={true} handleReplyState={handleReplyState} />
                    )
                }
            </div>
        </>
    )
}

