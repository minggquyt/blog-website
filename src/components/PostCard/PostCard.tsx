import { NavLink } from "react-router-dom"
import type { PostCard } from "../../types/index.ts"
import { useRef } from "react"
import './PostCard.css'

export default function PostCard({
    postId,
    postAuthorAvatar,
    postAuthorName,
    postCreateTime,
    postTitle,
    postRoles,
    postTotalReacts,
    postTotalComments,
    postTotalSave,
    postAuthorId
}: PostCard) {

    return (
        <div key={postId} className="post-item">
            <NavLink to={`/users/${postAuthorId}`} className="post-item-header">
                <img src={postAuthorAvatar} width="50px" height="50px" alt="" />
                <div className="post-item-header--userinfo">
                    <h3 className='post-item-header--username roboto-500' >{postAuthorName}</h3>
                    <p className='post-item-header--createtime roboto-300'>{postCreateTime}</p>
                </div>
            </NavLink>
            <NavLink to={`/${postAuthorId}/${postId}`} className="post-item-title">
                <h1 className='roboto-500' >{postTitle}</h1>
                <div className="post-item-tags inter-300">
                    {postRoles.map((role) => {
                        return (
                            <p key={role}>#{role}</p>
                        )
                    })}
                </div>
            </NavLink>
            <div className="post-item-footer">
                <div className='post-item-footer-left roboto-300' >
                    <div className="post-item-footer--react">
                        <span className="material-symbols-outlined">
                            add_reaction
                        </span>
                        {postTotalReacts}
                    </div>
                    <NavLink to={`/${postAuthorId}/${postId}/#commnets`} className="post-item-footer--comment">
                        <span className="material-symbols-outlined">
                            mode_comment
                        </span>
                        {postTotalComments}
                    </NavLink>
                </div>
                <div className="post-item-footer--bookmark">
                    <span className="material-symbols-outlined">
                        bookmark
                    </span>
                    {postTotalSave}
                </div>
            </div>
        </div>
    )
}