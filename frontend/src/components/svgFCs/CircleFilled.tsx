import React from 'react';
import './svgFCstyles.scss';

type CircleFilledProps = {
  fill: string,
  size: string
}
const CircleFilled = ({ fill, size }: CircleFilledProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 12.0508C9.31371 12.0508 12 9.36449 12 6.05078C12 2.73707 9.31371 0.0507812 6 0.0507812C2.68629 0.0507812 0 2.73707 0 6.05078C0 9.36449 2.68629 12.0508 6 12.0508Z" fill={fill}/>
      </svg>
    </div>
  );
}

export default CircleFilled;

