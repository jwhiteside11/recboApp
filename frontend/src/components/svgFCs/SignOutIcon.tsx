import React from 'react';
import './svgFCstyles.scss';

type SignOutIconProps = {
  fill: string,
  size: string
}
const SignOutIcon = ({ fill, size }: SignOutIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 22H5a3 3 0 01-3-3V5a3 3 0 013-3h2a1 1 0 000-2H5a5.006 5.006 0 00-5 5v14a5.006 5.006 0 005 5h2a1 1 0 000-2z" fill={fill}/>
      <path d="M18.538 18.707l4.587-4.586a3.007 3.007 0 000-4.242l-4.587-4.586a1 1 0 00-1.414 1.414L21.416 11H6a1 1 0 000 2h15.417l-4.293 4.293a1 1 0 101.414 1.414z" fill={fill}/>
      </svg>
    </div>
  );
}

export default SignOutIcon;
