import React from 'react';
import './svgFCstyles.scss';

type EditIconProps = {
  fill: string,
  size: string
}
const EditIcon = ({ fill, size }: EditIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.853 1.148a3.626 3.626 0 00-5.124 0L1.465 17.412A4.968 4.968 0 000 20.947V23a1 1 0 001 1h2.053a4.966 4.966 0 003.535-1.464L22.853 6.271a3.626 3.626 0 000-5.123zM5.174 21.122A3.022 3.022 0 013.053 22H2v-1.053a2.98 2.98 0 01.879-2.121L15.222 6.483l2.3 2.3zM21.438 4.857l-2.506 2.507-2.3-2.295 2.507-2.507a1.623 1.623 0 112.295 2.3z" fill={fill}/>
      </svg>
    </div>
  );
}

export default EditIcon;
