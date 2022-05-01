import React from 'react';
import './svgFCstyles.scss';

type DetailsIconProps = {
  fill: string,
  size: string
}
const DetailsIcon = ({ fill, size }: DetailsIconProps) => {
  return (
    <div  className="svgFC"style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="0.5" width="10.0125" height="13" stroke={fill}/>
        <line x1="2.50146" y1="3.5" x2="10.5105" y2="3.5" stroke={fill}/>
        <line x1="2.50146" y1="6.5" x2="8.50826" y2="6.5" stroke={fill}/>
        <line x1="2.50146" y1="9.5" x2="6.50599" y2="9.5" stroke={fill}/>
      </svg>
    </div>
  );
}

export default DetailsIcon;

