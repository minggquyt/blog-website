import './CommentCard.css';

export default function CommentCard() {
    // logic lọc comment có ảnh hay không 
    // Logic lọc có comment trả lời hay không 
    return (
        <div className="comment-card">
            <div className="comment-card-header">
                <div className='comment-card-header--userinfo'>
                    <img src="/images/users/user-1.png" width="50px" height="50px" alt="" />
                    <div>
                        <h3 className='roboto-500' >Minh Quý</h3>
                        <p className='roboto-300'>23 tháng 6, 2025</p>
                    </div>
                </div>
                <span className="material-symbols-outlined">
                    more_horiz
                </span>
            </div>
            <div className="comment-card-body">
                {/* img - lọc có ảnh hay không */}
                <p className='comment-card-body--content roboto-400'>Careful, you’re dangerously close to convincing me 😄
                    I’ll admit: once you start thinking about careers as graphs, it’s hard to unsee it.
                    Thanks for the kind words — they definitely make the writing pause feel… flexible.
                    By the way: did you try with yours?
                </p>
                <div className="comment-card-body--reaction">
                    <div className='comment-card-body--reaction--likes'>
                        <span className="material-symbols-outlined">
                            add_reaction
                        </span>
                        <p className='roboto-300'>2 likes</p>
                    </div>
                    <div className='comment-card-body--reaction--reply'>
                        <span className="material-symbols-outlined">
                            mode_comment
                        </span>
                        <p className='roboto-300'>Reply</p>
                    </div>
                    {/* div - lọc có comment trả lời hay không */}
                </div>
            </div>
        </div>
    )
}