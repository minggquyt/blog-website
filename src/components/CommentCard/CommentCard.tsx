import './CommentCard.css';

interface CommentCardProps {
    content: string,
    username: string,
    useravatar: string,
    created_at: string,
    likes: number,
    canReply: boolean,
    imageurl: string | undefined
}

export default function CommentCard({
    content,
    username,
    useravatar,
    created_at,
    likes,
    canReply,
    imageurl
}: CommentCardProps) {
    return (
        <div className="comment-card">
            <div className="comment-card-header">
                <div className='comment-card-header--userinfo'>
                    <img src={useravatar} width="50px" height="50px" alt="" />
                    <div>
                        <h3 className='roboto-500' >{username}</h3>
                        <p className='roboto-300'>{created_at}</p>
                    </div>
                </div>
                <span className="material-symbols-outlined">
                    more_horiz
                </span>
            </div>
            <div className="comment-card-body">
                {
                    imageurl &&  <img src={imageurl} width="200px" alt="" />

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
                                    <span className="material-symbols-outlined">
                                        mode_comment
                                    </span>
                                    <p className='roboto-300'>Reply</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}