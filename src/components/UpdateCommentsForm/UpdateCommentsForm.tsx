import { useRef, useEffect } from 'react';
import './UpdateCommentsForm.css'

interface UpdateCommentsFormProps {
    toggleEditBox: Function
    onClickUpdateCommentHandler: Function
}

export default function UpdateCommentsForm({
    toggleEditBox,
    onClickUpdateCommentHandler
}: UpdateCommentsFormProps) {
    const inputRef = useRef(null);

    function handleOnKeyDown(e: React.KeyboardEvent) {
        e.preventDefault();
        if (e.key == 'Enter') {
            // VÌ SAO Ở ĐÂY KHÔNG LẤY VALUE SỰ KIỆN ĐƯỢC ?
            const value = inputRef.current != null ? (inputRef.current as HTMLInputElement).value : null;
            console.log(value);
        }
    }


    function handleOnclick(e: React.FormEvent) {
        e.preventDefault();
        const inputValue = inputRef.current != null ? (inputRef.current as HTMLInputElement).value : null;
        console.log(inputValue);
    }

    useEffect(() => {
        toggleEditBox(false);
    },[])

    return (
        <div className="update-comment-form">
            <form action="">
                <input ref={inputRef} type="text" onKeyDown={handleOnKeyDown} />
                <button type='button' onClick={handleOnclick} >Gửi</button>
            </form>
            <button type='button' onClick={() => onClickUpdateCommentHandler(false)}>Nhấn vào dây để <strong>Hủy</strong></button>
        </div>
    )
}



