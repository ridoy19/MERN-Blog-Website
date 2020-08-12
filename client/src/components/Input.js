import React from 'react';


const Input = (props) => {
    return (
        <input 
            type={props.type} 
            name={props.name} 
            value={props.value} 
            placeholder={props.placeholder}
            className={props.className} 
            onChange={props.onChange}>
        </input>
    )
}


export default Input;