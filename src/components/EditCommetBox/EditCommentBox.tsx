import { useEffect } from 'react'
import { deleteCommnets } from '../../services/getData'
import './EditCommentBox.css'

interface EditCommentBoxProps {
    isSameUser: boolean
    onClickHandler: Function,
    onClickUpdateButtonHandler: Function
}

export default function EditCommentBox({
    onClickHandler,
    isSameUser,
    onClickUpdateButtonHandler
}: EditCommentBoxProps) {

    function handleEditComments(eventTarget: HTMLElement) {
        const value = eventTarget.id;
        const CommentCardId = (eventTarget.closest('.comment-card') as HTMLElement)?.dataset.id;

        if(CommentCardId == undefined){
            console.warn("can not get comment card id !");
            return;
        } 
        

        if(value.includes('delete-comments')){
            CommentCardId != undefined && deleteCommnets(CommentCardId);
        }
        else if(value.includes('update-comments')){
            console.log("logic update")
            onClickUpdateButtonHandler(true);
        }
        else if(value.includes('report-comments')){
            console.log("logic report")
        }
        else
            console.warn("Error event target in edit comments is undefined !");
    }

    useEffect(() => {

        function addDocumentEvent(event: MouseEvent) {
            const eventTarget = (event.target as HTMLElement);
            const editBox = document.querySelector(".edit-comment-box");

            if (editBox?.contains(eventTarget) == false)
                onClickHandler(event);
            else
                handleEditComments(eventTarget);
        }

        document.addEventListener('click', addDocumentEvent);

        return () => {
            document.removeEventListener('click', addDocumentEvent);
        }
    }, [])

    return (
        isSameUser ? (
            <div className="edit-comment-box">
                <p id='delete-comments' className='roboto-300'>Xóa</p>
                <p id='update-comments' className='roboto-300'>Chỉnh sửa</p>
                <p id='report-commets' className='roboto-300' >Báo cáo</p>
            </div>
        ) : (
            <div className="edit-comment-box">
                <p id='report-comments' className='roboto-300'>Báo cáo</p>
            </div>
        )
    )
}
