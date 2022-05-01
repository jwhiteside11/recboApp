import React from 'react';
import './svgFCstyles.scss';

type ProfileIconProps = {
  fill: string,
  size: string
}
const ProfileIcon = ({ fill, size }: ProfileIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0H5a5.006 5.006 0 00-5 5v14a5.006 5.006 0 005 5h14a5.006 5.006 0 005-5V5a5.006 5.006 0 00-5-5zM7 22v-1a5 5 0 0110 0v1zm15-3a3 3 0 01-3 3v-1a7 7 0 00-14 0v1a3 3 0 01-3-3V5a3 3 0 013-3h14a3 3 0 013 3z" fill={fill}/>
      <path d="M12 4a4 4 0 104 4 4 4 0 00-4-4zm0 6a2 2 0 112-2 2 2 0 01-2 2z" fill={fill}/>
      </svg>
    </div>
  );
}

export default ProfileIcon;
