import React, { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";


const DiaryItem = ({ author, content, created_date, emotion, id }) => {

    const { onRemove, onEdit } = useContext(DiaryDispatchContext);

    const [isEdit,setIsEdit] = useState(false); //수정 중인지 상태로 표시, true일때 수정중인 상태
    const toggleIsEdit = () => setIsEdit(!isEdit); //isEdit이 true라면 false로, false라면 true로 바뀌는 토글기능

    const [localContent, setLocalContent] = useState(content);
    const localContentInput = useRef();
    const handleRemove = () => {
        if(window.confirm(`${id}번째 일기를 삭제하시겠습니까?`)){
            onRemove(id);
        }
    };

    const handleQuitEdit = () => {
        setIsEdit(false);
        setLocalContent(content);
    };

    const handleEdit = () => {

        if(localContent.length < 5){
            localContentInput.current.focus();
            return;
        }

        if(window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)){
            onEdit(id,localContent);
            toggleIsEdit();
        }
    };

    return <div className="DiaryItem">
        <div className="info">
            <span>
                작성자 : {author} | 감정 점수 : {emotion}
            </span>
            <br />
            <span className="date">
                {new Date(created_date).toLocaleString()}
            </span>
        </div>
        <div className="content">
            {isEdit ? (
            <>
                <textarea 
                    ref={localContentInput}
                    value={localContent} 
                    onChange={(e)=>setLocalContent(e.target.value)}
                />
            </>) : (<>{content}</>)}
        </div>

        {isEdit ? <>
            <button onClick={handleQuitEdit}>수정 취소</button>
            <button onClick={handleEdit}>수정 완료</button>
        </> : <>
            <button onClick={handleRemove}>삭제하기</button>
            <button onClick={toggleIsEdit}>수정하기</button>
        </>
        }
        
    </div>
};

export default React.memo(DiaryItem);