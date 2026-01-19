import { useEffect } from 'react';
import './CommentBox.css'

interface CommentBoxProps {
    userAvatar: string;
    isReply: boolean;
    handleReplyState: Function| null;
}

export default function CommentBox({
    userAvatar,
    isReply,
    handleReplyState
}: CommentBoxProps) {

    isReply  && handleReplyState && useEffect(() => {

        function handleEventClick(){
            handleReplyState!= null && handleReplyState(null);
        }

        const postComment = document.querySelector(".post-comments");
        postComment?.addEventListener('click',handleEventClick);

        return () => {
            postComment != null && postComment.removeEventListener('click',handleEventClick);
        }
    },[]);

    return (
        !isReply ? (
            // parent comment box
            <div className="post-detail-comments--userinput">
                <img src={userAvatar} width="50px" height="50px" alt="" />
                <form  onSubmit={(e) => e.preventDefault() }  action=""><input className='post-comments roboto-300' type="text" placeholder='Thêm bình luận' /></form>
            </div>
        ) : (
            // children reply box
            <div className="post-detail-comments--userinput post-detail-comments--userinput--reply">
                <img src={userAvatar} width="50px" height="50px" alt="" />
                <form onSubmit={(e) => e.preventDefault() } action=""><input className='sub-comments roboto-300' type="text" placeholder='Thêm bình luận' /></form>
            </div>
        )

    )
}