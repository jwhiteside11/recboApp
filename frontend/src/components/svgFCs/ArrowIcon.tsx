import React from 'react';
import './svgFCstyles.scss';

type ArrowIconProps = {
  fill: string,
  size: string,
  degZ?: number,
  deg: number
}
const ArrowIcon = ({ fill, size, degZ = 90, deg }: ArrowIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px", transform: `rotateZ(${degZ % 360}deg) rotateY(${deg % 360}deg)`, transition: 'transform 0.2s ease'}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6 12.707a1 1 0 010-1.414l4.585-4.586a1 1 0 00-1.414-1.414L9.189 9.879a3 3 0 000 4.242l4.586 4.586a1 1 0 001.414-1.414z" fill={fill}/>
      </svg>
    </div>
  );
}

export default ArrowIcon;
