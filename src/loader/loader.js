import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader'

const loaderStyles = {
    position: 'fixed',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
}

const Loader = (props) => {

    return (
        <div style={loaderStyles}>
            <MoonLoader
                loading={props.loader} 
                sizeUnit={"px"}
                size={100}
                color={'#f44336'}
            />
        </div>
    )  
}

export default Loader;