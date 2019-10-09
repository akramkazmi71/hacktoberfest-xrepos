import React from 'react';
import MoonLoader from 'react-spinners/BeatLoader'

const loaderStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '10px',
  marginBottom: '10px'
}

const Loader = (props) => {

  return (
    <div style={loaderStyles}>
      <MoonLoader
        loading={props.loader}
        sizeUnit={"px"}
        size={15}
        color={'#a11ec6'}
      />
    </div>
  )
}

export default Loader;