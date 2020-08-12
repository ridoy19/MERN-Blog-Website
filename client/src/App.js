import React, { createContext, useReducer } from 'react';
import './App.css';
import Nav from './components/Nav';
import { ToastContainer } from 'react-toastify';
import { reducer, initialState } from './reducers/AuthReducer'

export const AuthContext = createContext();


function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AuthContext.Provider value={{ userState: state, userDispatch: dispatch }}>
      <div className="App">
        <Nav />
        <ToastContainer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
