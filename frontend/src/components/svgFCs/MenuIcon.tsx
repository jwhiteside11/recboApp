import React from 'react';
import './svgFCstyles.scss';

type MenuIconProps = {
  fill: string,
  size: string
}
const MenuIcon = ({ fill, size }: MenuIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="11" width="24" height="2" rx="1" fill={fill}/>
      <rect y="4" width="24" height="2" rx="1" fill={fill}/>
      <rect y="18" width="24" height="2" rx="1" fill={fill}/>
      </svg>
    </div>
  );
}

export default MenuIcon;
