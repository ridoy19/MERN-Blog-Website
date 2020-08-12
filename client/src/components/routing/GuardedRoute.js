import React from 'react';
import { Route, Redirect } from "react-router-dom";

// const GuardedRoute = ({ component: Component, auth, ...rest }) => (
//     <Route {...rest} render={(props) => (
//         auth === true
//             ? <Component {...props} />
//             : <Redirect to='/' />
//     )} />
// )

const GuardedRoute = ({ component: Component, ...rest }) => {  
    const jwtToken = localStorage.getItem('token')
  
    return (
      <Route {...rest} render={props => (
       jwtToken !== null ? (
        < Component  {...props} />
        ) : (
              <Redirect to={{
                pathname: '/',
                state: { from: props.location }
                }}
              />
            )
        )} 
      />
    )
  };

export default GuardedRoute;