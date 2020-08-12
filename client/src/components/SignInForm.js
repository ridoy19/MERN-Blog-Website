import React, { useState, useContext } from 'react';
import Button from './Button'
import Input from './Input'
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../App'


const SignInForm = () => {
    const authContext = useContext(AuthContext);
    const history = useHistory();
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    })

    const handleChange = (event) => {
        const { value, name } = event.target
        setUserInfo(prevValue => {
            return({
                ...prevValue,
                [name]: value
            })
        });
    }

    const handleSignInClick = async (event) => {
        event.preventDefault();
        try {
            const res = await Axios.post('/api/auth/login', JSON.stringify(userInfo), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user",JSON.stringify(res.data.user))
            authContext.userDispatch({ type: "USER_LOGIN", payload: res.data})

            toast.success("Signed in successful!", {
                className: "success-toast",
                autoClose: 3000,
                position: toast.POSITION.BOTTOM_RIGHT
            })
            history.push('/')
            //console.log(res)
        } catch (error) {
            //console.error(error)
            toast.error(error.response.data.error.message, {
                className: "error-toast",
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000
            })
        }
    }

    return (
        <div className="card text-center mx-auto mt-5" style={{height: "22rem", width: "28rem"}}>
            <div className="card-body">
                <h4 className="card-title">Sign In</h4>
                <form>
                    <Input 
                        type="text" 
                        name="email"
                        value={userInfo.email}
                        className="form-control form-control-lg mt-5" 
                        placeholder="Enter email address" 
                        onChange={handleChange} />
                    <Input 
                        type="password" 
                        name="password"
                        value={userInfo.password}
                        className="form-control form-control-lg mt-3" 
                        placeholder="Enter password" 
                        onChange={handleChange} />
                    <Button 
                        type="submit" 
                        onClick={handleSignInClick}
                        className="btn btn-block btn-lg btn-success mt-5"> Sign In </Button>
                </form>
                <p className="mt-2">New to Blogstar? <Link to="/signup">Create an account</Link> </p>
            </div>
        </div>
        
    )
}


export default SignInForm;