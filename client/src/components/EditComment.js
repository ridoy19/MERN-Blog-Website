import React, { Fragment, useState } from 'react';
import Input from '../components/Input';
import Axios from 'axios';

export const EditComment = (props) => {
    const [commentBody, setComment] = useState(props.comment.commentBody);
    // console.log(props.comment._id)
    const [commentState, setCommentState] = useState(props.state);

    const handleEditChangeComment = (event, id) => {
        const { value, name } = event.target;
        setComment(value); 
    }

    console.log(commentState)

    const handleCommentEdit = async (postid, commentid) => {
        try {
            const res = await Axios.patch(`/api/posts/${postid}/comments/${commentid}`,JSON.stringify({commentBody}), {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' +localStorage.getItem('token')
                }
            })
            // props.setState(prevValue => {
            //     return [...prevValue, res.data.info]
            // });
            props.setState(res.data.info);
            console.log(res)
        } catch (error) {
            console.log( error.response.request );
        }
    }

    return(
        <Fragment>
            <i 
                data-toggle="modal" data-target={`#exampleModal${props.comment._id}`}
                className="fa fa-pencil ml-3" 
                style={{color: "blue", cursor: 'pointer'}}></i>
            <div 
                className="modal fade" 
                id={`exampleModal${props.comment._id}`} 
                tabIndex="-1" role="dialog" 
                aria-labelledby="exampleModalLabel" 
                aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 
                        className="modal-title" 
                        id="exampleModalLabel">Modal title</h5>
                    <button 
                        type="button" 
                        className="close" 
                        data-dismiss="modal" 
                        aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Input 
                        type="text" 
                        name="commentBody" 
                        value={commentBody} 
                        onChange={ handleEditChangeComment } 
                        className="form-control" />
                </div>
                <div className="modal-footer">
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        data-dismiss="modal">Close</button>
                    <button 
                        type="button" 
                        onClick={() => handleCommentEdit(props.postid, props.comment._id)}
                        data-dismiss="modal"
                        className="btn btn-warning">Save changes</button>
                </div>
                </div>
            </div>
            </div>
        </Fragment>
    )
}