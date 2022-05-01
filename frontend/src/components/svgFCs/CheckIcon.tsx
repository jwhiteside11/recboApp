import React from 'react';
import './svgFCstyles.scss';

type CheckIconProps = {
  fill: string,
  size: number
}
const CheckIcon = ({ fill, size }: CheckIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10L8 13L15 4" stroke={fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth={size / 4} />
      </svg>
    </div>
  );
}

export default CheckIcon;
