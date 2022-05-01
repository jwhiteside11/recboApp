import React from 'react';
import './svgFCstyles.scss';

type PlusSignIconProps = {
  fill: string,
  size: string
}
const PlusSignIcon = ({ fill, size }: PlusSignIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7 0C5.89543 0 5 0.89543 5 2V4.99999H2C0.895431 4.99999 0 5.89542 0 6.99999C0 8.10456 0.89543 8.99999 2 8.99999H5V12C5 13.1046 5.89543 14 7 14C8.10457 14 9 13.1046 9 12V8.99999H12C13.1046 8.99999 14 8.10456 14 6.99999C14 5.89542 13.1046 4.99999 12 4.99999H9V2C9 0.895431 8.10457 0 7 0Z" fill={fill}/>
      </svg>
    </div>
  );
}

export default PlusSignIcon;
