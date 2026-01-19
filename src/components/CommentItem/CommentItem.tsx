import CommentCard from "../CommentCard/CommentCard"
import type { CommentCardData } from "../../types/comments"

interface CommentItemProps {
    currentComment: CommentCardData,
    currentCommentUser: any,
    replyCommentId: string | null,
    onReplyState: Function,
    currentCommentLevel: number
}

export default function CommentItem({
    currentComment,
    currentCommentUser, 
    replyCommentId,
    onReplyState,
    currentCommentLevel
}: CommentItemProps) {
    return (
        <>
            <CommentCard
                commentCardId={currentComment.id}
                content={currentComment.content}
                username={currentComment.user_profiles.display_name}
                useravatar={currentComment.user_profiles.avatar_url}
                author_id={currentComment.user_profiles.id}
                created_at={currentComment.created_at}
                likes={currentComment.likes}
                canReply={Number(currentComment.level) < 3}
                imageurl={currentComment.imageUrl}
                currentReplyUser={currentCommentUser}
                isDisplayReplyBox={replyCommentId == currentComment.id} 
                handleReplyState={onReplyState}
                marginleft={Number(currentComment.level)  == 2 ? '40px' : Number(currentCommentLevel) == 3 ? '80px' : ''}
            />
            {
                currentCommentLevel <= 3 && currentComment.children.map((c) => {
                    return (
                        <CommentItem
                            key={c.id}
                            currentComment={c}
                            currentCommentUser={currentCommentUser}
                            replyCommentId={replyCommentId}
                            onReplyState={onReplyState}
                            currentCommentLevel={Number(c.level)}
                        />
                    )
                })
            }
        </>
    )
}
