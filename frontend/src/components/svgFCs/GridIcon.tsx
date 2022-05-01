import React from 'react';
import './svgFCstyles.scss';

type GridIconProps = {
  fill: string,
  size: string
}
const GridIcon = ({ fill, size }: GridIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="8" height="8" rx="2" fill={fill}/>
        <rect x="10" width="8" height="8" rx="2" fill={fill}/>
        <rect y="10" width="8" height="8" rx="2" fill={fill}/>
        <rect x="10" y="10" width="8" height="8" rx="2" fill={fill}/>
      </svg>
    </div>
  );
}

export default GridIcon;
