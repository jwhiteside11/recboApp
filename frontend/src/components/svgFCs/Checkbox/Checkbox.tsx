import React from 'react';
import './Checkbox.scss';

type CheckboxProps = {
  background: string,
  fill: string,
  size: number
}
const Checkbox = ({ background, fill, size }: CheckboxProps) => {
  return (
    <div style={{width: size + "px", height: size + "px"}} className="scale">
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="73" height="73" rx="12" fill={background}/>
        <path className="path" d="M16 40.2568L29.9152 51.2363C30.7677 51.909 32.0013 51.7784 32.6942 50.9421L57.5 21" stroke={fill} strokeWidth={size / 8 + 8} strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default Checkbox;
