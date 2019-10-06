import React from 'react';


const loaderStyles = {
    position: 'fixed',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
}

const loaderTextStyle = {
    display:'inline-block',
    color:'#673AB7',
    fontWeight: '400'
}

const dotsStyle = {
    width:'1px',
    display:'inline-block',
    color:'#f44336'
}

const Loader = (props) => {
    let dots = '.'
    let maxlen = 4;
    const [state, setstate] = React.useState('.')

    const dotstimer = setInterval(()=>{
        setstate(state+dots)
        if(state.length === maxlen )
            setstate('.')
    },500)
    
    React.useEffect(() => {
        return () => clearInterval(dotstimer)
    })

    return (
        <div style={loaderStyles}>
            <h1 style={loaderTextStyle}>Loading <span style={dotsStyle}>{state}</span></h1>
        </div>
    )  
}

export default Loader;