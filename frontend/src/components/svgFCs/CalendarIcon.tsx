import React from 'react';
import './svgFCstyles.scss';

type CheckIconProps = {
  fill: string,
  size: number
}
const CheckIcon = ({ fill, size }: CheckIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 3H4C2.89543 3 2 3.89543 2 5V19C2 20.1046 2.89543 21 4 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3Z" stroke={fill} strokeWidth={size / 8} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 1V5" stroke={fill} strokeWidth={size / 8} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 1V5" stroke={fill} strokeWidth={size / 8} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 9H20" stroke={fill} strokeWidth={size / 8} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default CheckIcon;
