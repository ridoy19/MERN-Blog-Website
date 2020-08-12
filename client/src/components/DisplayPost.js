import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Axios from 'axios';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/DateFormat';
import ReactHtmlParser from 'react-html-parser';
import { AuthContext } from '../App';
import { EditComment } from '../components/EditComment';

const DisplayPost = (props) => {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { postid } = useParams();
    const [post, setPost] = useState({});
    const history = useHistory();
    const [isExpanded, setIsExpanded] = useState(false);
    const [commentBody, setComment] = useState('');
    const [commentState, setCommentState] = useState([]);
    const [author, setAuthor] = useState(props.location.author);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const source = Axios.CancelToken.source();
        const singlePost = async () => {
        try {
            const res = await Axios.get(`/api/posts/post-details/${postid}`, {
                cancelToken: source.token
            });
            setAuthor(res.data.info.author.name)
            setPost(res.data.info);
            setCommentState(res.data.info.comments);
        } catch (error) {
                if (Axios.isCancel(error)) {
                    console.log('cancelled');
                } else {
                    throw error;
                }
            }
        }
        
        singlePost();
        return () => {
            source.cancel();
        };
    },[postid])


    const handleChange = (event) => {
        setComment(event.target.value);
    }

    // console.log(commentState);

    const handleComment = async (event) => {
        event.preventDefault();
        const loggedUser = localStorage.getItem('user');
        if (!loggedUser) {
            history.push('/signin');
        }else {
        try {
            const res = await Axios.post(`/api/posts/${postid}/comments`, JSON.stringify({ commentBody }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            
            // console.log(res.data);
            // TODO : Toast not showing don't know why?? Fix It!
            toast.success(res.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            }) 
            setCommentState(prevValue => {
                return [...prevValue, res.data.info]
            });
            setComment('');
            setIsExpanded(false);
        } catch (error) {
                // console.log(error.response);
                toast.error(error.response.data.message, {
                    autoClose: 3000,
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        }
        
    }
    // console.log(post.comments)
    // console.log(props.comment._id)

    // Edit Comment
    

    /**
     * Perform comment deletion
     * @param {string} postid 
     * @param {string} commentid 
     */
    const handleCommentDelete = async (postid, commentid) => {
        try {
            const res = await Axios.delete(`/api/posts/${postid}/comments/${commentid}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            toast.success(res.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
            const newCommentState = commentState.filter(comment => comment._id !== commentid);
            setCommentState(newCommentState);
            // console.log(res);
        } catch (error) {
            // console.log(error);
            toast.error(error.response.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }


    // Post upvotes / downvotes
    const handleUpvotes = async () => {
        const loggedUser = localStorage.getItem('user');
        if (!loggedUser) {
            history.push('/signin');
        }else {
            try {
                const res = await Axios.put(`/api/posts/${postid}/upvotes`, JSON.stringify(loggedUser._id), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                // console.log(res.data);
                setPost(res.data.info)
                toast.success(res.data.message, {
                    autoClose: 3000,
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } catch (error) {
                // console.log(error.response.data.message)
                toast.error(error.response.data.message, {
                    autoClose: 3000,
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }   
        }   
    }
    

    const handleDownvotes = async () => {
        const loggedUser = localStorage.getItem('user');
        if (!loggedUser) {
            history.push('/signin');
        }else {
            try {
                const res = await Axios.put(`/api/posts/${postid}/downvotes`, JSON.stringify(loggedUser._id), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                // console.log(res.data);
                setPost(res.data.info)
                toast.success(res.data.message, {
                    autoClose: 3000,
                    position: toast.POSITION.BOTTOM_RIGHT
                })

            } catch (error) {
                // console.log(error.response.data.message)
                toast.error(error.response.data.message, {
                    autoClose: 3000,
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            } 
        }
    }
    // console.log(post);
    return (
        <div className="container">
        <div className="row">
            <div className="col-10 text-center">
                <div className="card mt-3">
                    <h1 className="mt-2">{post.title}</h1>
                        <p>
                            <i 
                                className="fa fa-user mr-1" 
                                aria-hidden="true"></i> {author}</p>
                        <p>
                            <i 
                                className="fa fa-calendar mr-1" 
                                aria-hidden="true"></i> {formatDate(post.createdAt)}</p>
                    <hr></hr>
                    <div className="text-justify p-2">
                        {/* { ReactHtmlParser(post.content)} */}
                        {ReactHtmlParser(post.content)}
                    </div>
                </div>
             </div>
             <div className="col-2 mt-3 float-right">
                    <Button 
                        type="button"
                        onClick={() => handleUpvotes() } 
                        className="btn btn-block btn-success">
                        Likes <span className="badge badge-warning">{post.upvotes}</span>
                    </Button>
                    <Button 
                        type="button"
                        onClick={() => handleDownvotes() }  
                        className="btn btn-block btn-dark">
                        Dislike <span className="badge badge-danger">{post.downvotes}</span>
                    </Button>
                    {/* <Button 
                        type="button"
                        className="btn btn-block btn-info">
                        Comments <span className="badge badge-warning">{post.comments && post.comments.length}</span>
                    </Button> */}
                </div>   
        </div>
        <div className="row mt-3">
            <div className="col-12 text-justify">

                <form>
                <p className="text-primary"
                    name="add-comment" 
                    onClick={() => {setIsExpanded(true)}} 
                    style={{cursor: 'pointer'}}>
                {
                    isExpanded ? 
                    <textarea 
                        onChange={ handleChange } 
                        name="commentBody" 
                        value={ commentBody } 
                        placeholder="Enter your comment" 
                        rows="5" 
                        cols="100"></textarea>: "add a comment"
                }
                </p>
                {
                    isExpanded && 
                    <Button 
                        type="submit" 
                        onClick={ handleComment } 
                        className="btn btn-primary">Add Comment</Button>
                }
                </form>
            </div>    
        </div>
        <div className="row mt-3">
            <div className="col-10 text-justify">
                <h6>Comments</h6>
                {
                    commentState.length > 0 ? commentState.map((comment, index) => {
                        return(
                            <div key={index} className="mb-2">
                                <span className="mr-2">{comment.commentBody}</span>
                                <span className="mr-2 text-primary"><em>-{comment.commentBy.name}</em></span>
                                <span className="text-secondary"><em>{formatDate(comment.createdAt)}</em></span>
                                {
                                    authContext.userState.user && authContext.userState.user._id === comment.commentBy._id &&
                                    <Fragment>
                                        {/* <span onClick={() => <EditComment comment={comment}/>}>
                                        <i 
                                            className="fa fa-pencil ml-3" 
                                            style={{color: "blue", cursor: 'pointer'}}></i>
                                        </span> */}
                                        <EditComment setState={setCommentState} state={commentState} cmtid={comment._id} comment={comment} postid={postid}/>
                                        <i 
                                            className="fa fa-trash ml-3" 
                                            onClick={() => handleCommentDelete(postid, comment._id)}  
                                            style={{color: "red", cursor: 'pointer'}}></i>
                                    </Fragment>
                                }
                                
                            </div>
                        )
                        
                    }) :""  
                }                
            </div>          
        </div>
        </div>
    );
}


export default DisplayPost;