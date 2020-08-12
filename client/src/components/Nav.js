import React, { useContext } from "react";
import { 
    BrowserRouter as Router,
    Link,
    NavLink,
    useHistory
} from 'react-router-dom';
import Button from './Button';
import Routing from './routing/Routing'
import Footer from '../components/Footer';
import { AuthContext } from '../App'
import { toast } from 'react-toastify';


const Nav = () => {
    const authContext = useContext(AuthContext);
    //const history = useHistory();
    const handleSignOut = () => {
        localStorage.clear();
        authContext.userDispatch({type: 'USER_LOGOUT'});

        toast.success("Singout successful!", {
            className: "success-toast",
            autoClose: 3000,
            position: toast.POSITION.BOTTOM_RIGHT
        })
        //history.push('/')
    }

    return (
        <div>
        <Router>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link to="/" className="navbar-brand">Blogstar</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item" key="1">
                            <NavLink 
                                className="nav-link" 
                                exact 
                                activeStyle={{ fontWeight: 'bold' }} 
                                to="/">Dashboard</NavLink>
                        </li>,
                        <li className="nav-item" key="2">
                            <NavLink 
                                className="nav-link" 
                                to="/about" 
                                activeStyle={{ fontWeight: 'bold' }}>About</NavLink>
                        </li>
                        {
                            authContext.userState.isAuthenticated ? [
                                <li className="nav-item" key="3">
                                    <NavLink 
                                        className="nav-link" 
                                        activeStyle={{ fontWeight: 'bold' }} 
                                        to="/compose">Compose</NavLink>
                                </li>,
                                <li className="nav-item" key="4">
                                <NavLink 
                                    className="nav-link" 
                                    activeStyle={{ fontWeight: 'bold' }} 
                                    to="/profile">Profile</NavLink>
                                </li>,
                                <li className="nav-item" key="5">
                                <NavLink 
                                    onClick={handleSignOut}
                                    className="nav-link" 
                                    activeStyle={{ fontWeight: 'bold' }} 
                                    to="/">Sign Out</NavLink>
                                    {/* <Button className="btn btn-danger" onClick={handleSignOut}>Sign Out</Button> */}
                                </li>
                            ]: [
                                
                                <li className="nav-item" key="6">
                                    <NavLink 
                                        className="nav-link" 
                                        activeStyle={{ fontWeight: 'bold' }} 
                                        to="/signin">Sign In</NavLink>
                                </li>,
                                <li className="nav-item" key="7">
                                    <NavLink 
                                        className="nav-link" 
                                        activeStyle={{ fontWeight: 'bold' }} 
                                        to="/signup"> Sign Up </NavLink>
                                </li>
                            ]                                
                        }
                        
                    </ul>
                    {/* <Button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={() => navigateTo } >{ isLogged ? "Logout" : "Login" }</Button>
                    <Button className="btn btn-outline-primary ml-3 my-sm-0" type="submit">Register</Button> */}
                </div>
            </nav>
            <Routing />
            <Footer />
            </Router>
        </div>
        
    )
}



export default Nav;