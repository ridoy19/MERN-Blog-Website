import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';


const Editor = (props) => {
    return (
        <div>
            <CKEditor 
                editor={props.editor} 
                config={props.config} 
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}


export default Editor;