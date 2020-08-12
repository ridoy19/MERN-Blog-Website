import React, { useEffect, useContext } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard';
import About from '../../pages/About';
import Compose from '../../pages/Compose';
import NotFound from '../../pages/NotFound'
import SignInForm from '../SignInForm';
import SignUpForm from '../SignUpForm';
import Profile from '../../pages/Profile';
import { AuthContext } from '../../App';
import DisplayPost from '../DisplayPost'

const Router = () => {
    const history = useHistory();
    const authContext = useContext(AuthContext)
    useEffect(() => {
        // console.log(localStorage.getItem("token"))
        // console.log(JSON.parse(localStorage.getItem("user")))
        // const user = JSON.parse(localStorage.getItem("user"))
        // console.log('Use effect calling...')
        if (!authContext.userState.isAuthenticated) {
            history.push('/')
        }

    },[history, authContext.userState.isAuthenticated])
    
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/about" component={About} />
            <Route path="/compose" component={Compose} />
            <Route path="/signin" component={SignInForm} />
            <Route path="/signup" component={SignUpForm} />
            <Route path="/posts/post-details/:postid" component={DisplayPost} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
        </Switch>
    )
}

export default Router;