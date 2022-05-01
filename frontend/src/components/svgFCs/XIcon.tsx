import React from 'react';
import './svgFCstyles.scss';

type XIconProps = {
  fill: string,
  size: string
}
const XIcon = ({ fill, size }: XIconProps) => {
  return (
    <div  className="svgFC"style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.25 5.26001L13.7353 13.7453" stroke={fill} strokeWidth={parseInt(size) / 4} strokeLinecap="round"/>
      <path d="M13.7353 5.25471L5.25 13.74" stroke={fill} strokeWidth={parseInt(size) / 4} strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default XIcon;