import React, { useState } from 'react';
import Button from './Button'
import Input from './Input'
import { Link, useHistory } from 'react-router-dom'
import Axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();
const SignUpForm = () => {
    const history = useHistory();
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const { value, name } = event.target;
        setUserInfo(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }  
        });
    }

    const postUserInfo = async (event) => {
        event.preventDefault();
        try {
            const res = await Axios.post('/api/auth/signup', JSON.stringify(userInfo), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success(res.data.message, {
                className: "success-toast",
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            }); 
            history.push('/signin');
            //console.log(res)
        } catch (error) {
            toast.error(error.response.data.error.message, {
                className: "error-toast",
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            });            
            //console.log(error.response.data.error.message) 
        }
        
    }

    return (
        <div className="card text-center mx-auto mt-5" style={{height: "30rem", width: "32rem"}}>
            <div className="card-body">
                <h4 className="card-title">Sign Up</h4>
                <form>
                    <Input 
                        type="text" 
                        name="name"
                        className="form-control mt-3 form-control-lg mt-4" 
                        placeholder="Enter name"
                        value={userInfo.name} 
                        onChange={handleChange} />
                    <Input 
                        type="email" 
                        name="email"
                        className="form-control mt-3 form-control-lg" 
                        placeholder="Enter email" 
                        onChange={handleChange}
                        value={userInfo.email}  />
                    <Input 
                        type="password" 
                        name="password"
                        className="form-control mt-3 form-control-lg" 
                        placeholder="Enter password"
                        value={userInfo.password}  
                        onChange={handleChange} />
                    <Input 
                        type="password" 
                        name="repassword"
                        className="form-control mt-3 form-control-lg" 
                        placeholder="Re-type password"
                        value={userInfo.rePassword}  
                        onChange={handleChange} />
                    
                    <Button 
                        type="submit" 
                        onClick={postUserInfo}
                        className="btn btn-lg btn-block btn-success mt-5"> Sign Up </Button>
                </form>
                <p className="mt-2">Already have an account? <Link to="/signin">Sign In</Link> </p>
            </div>
            {/* <ToastContainer /> */}
        </div>
    )
}


export default SignUpForm;