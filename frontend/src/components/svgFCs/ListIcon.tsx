import React from 'react';
import './svgFCstyles.scss';

type ListIconProps = {
  fill: string,
  size: string
}
const ListIcon = ({ fill, size }: ListIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 6h16a1 1 0 000-2H7a1 1 0 000 2zm16 5H7a1 1 0 000 2h16a1 1 0 000-2zm0 7H7a1 1 0 000 2h16a1 1 0 000-2z" fill={fill}/>
        <circle cx="2" cy="5" r="2" fill={fill}/>
        <circle cx="2" cy="12" r="2" fill={fill}/>
        <circle cx="2" cy="19" r="2" fill={fill}/>
      </svg>
    </div>
  );
}

export default ListIcon;
