import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Editor from '../components/Editor';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

const Compose = () => {
    const history = useHistory();
    const [blogPost, setBlogPost] = useState({
        title: '',
        content: ''
    });

    const handleChange = (event) => {
        const { value, name } = event.target;
        setBlogPost((prevValue) => {
            return ({
                ...prevValue,
                [name]: value
            })
        })
    
    }

    const handeEditorChange = (event, editor) => {
        const data = editor.getData();
        setBlogPost((prevValue) => {
            return ({
                ...prevValue,
                content : data
            })
        })
        //console.log(data)
    }

    // const postDetails = async () => {
    //     const data = new FormData();
    //     data.append('file', blogPost.content);
    //     data.append('upload_preset', 'blogstar');
    //     data.append('cloud_name', 'jakaria');
    //     await Axios.post('https://api.cloudinary.com/v1_1/jakaria/image/upload', JSON.stringify(data))
    // }

    const handleClick = async (event) => {
        event.preventDefault();
        try {
            const res = await Axios.post('/api/posts/compose', JSON.stringify(blogPost), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            //console.log(res)
            //postDetails();
            toast.success(res.data.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            })
            history.push('/')
            //console.log(res)
        } catch (error) {
            //console.log(error.response)
            toast.error(error.response.data.error.message, {
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    
    return (
        <div>
            <div className="card text-center mx-auto mt-5" style={{height: "24rem", width: "48rem"}}>
            <div className="card-body">
                <h4 className="card-title">Create your post</h4>
                <form>
                    <Input 
                        type="text" 
                        name="title"
                        className="form-control form-control-lg mt-5 mb-3" 
                        placeholder="Enter post title"
                        onChange={ handleChange } 
                        value={ blogPost.title } />
                    <div className="form-group">
                        <Editor 
                            editor={ ClassicEditor } 
                            config={{
                                // ckfinder: {
                                //     uploadUrl: 'https://api.cloudinary.com/v1_1/jakaria/image/upload' 
                                // }
                            }}
                            onChange={ handeEditorChange }
                            value={ blogPost.content }
                        />
                    </div>
                    
                    {/* <div className="form-group">
                        <textarea 
                            name="content" 
                            className="form-control" 
                            onChange={handleChange} 
                            rows="3"
                            value={blogPost.content} 
                            placeholder="Enter your content..."></textarea>
                    </div> */}
                    <Button 
                        type="submit" 
                        onClick={ handleClick }
                        className="btn btn-block btn-lg btn-success mt-5"> Create Post </Button>
                </form>
            </div>
            </div>
        </div>
    )
}


export default Compose;