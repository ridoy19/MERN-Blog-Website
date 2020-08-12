import React from 'react';

const Button = (props) => {
    return (
        <button 
            type={props.type} 
            className={props.className}
            value={props.value}
            onClick={props.onClick}>{props.children}</button>
    );
}


export default Button;