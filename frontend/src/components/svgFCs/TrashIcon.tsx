import React from 'react';
import './svgFCstyles.scss';

type TrashIconProps = {
  fill: string,
  size: string
}
const TrashIcon = ({ fill, size }: TrashIconProps) => {
  return (
    <div  className="svgFC"style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 4h-3.1A5.009 5.009 0 0013 0h-2a5.009 5.009 0 00-4.9 4H3a1 1 0 000 2h1v13a5.006 5.006 0 005 5h6a5.006 5.006 0 005-5V6h1a1 1 0 000-2zM11 2h2a3.006 3.006 0 012.829 2H8.171A3.006 3.006 0 0111 2zm7 17a3 3 0 01-3 3H9a3 3 0 01-3-3V6h12z" fill={fill}/>
      <path d="M10 18a1 1 0 001-1v-6a1 1 0 00-2 0v6a1 1 0 001 1zm4 0a1 1 0 001-1v-6a1 1 0 00-2 0v6a1 1 0 001 1z" fill={fill}/>
      </svg>
    </div>
  );
}

export default TrashIcon;

