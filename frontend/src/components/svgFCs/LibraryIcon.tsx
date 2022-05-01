import React from 'react';
import './svgFCstyles.scss';

type LibraryIconProps = {
  fill: string,
  size: string
}
const LibraryIcon = ({ fill, size }: LibraryIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9,3.091A4,4,0,0,0,14.9.153L13.176.646A2.981,2.981,0,0,0,12,1.3,2.981,2.981,0,0,0,10.824.646L9.1.153A4,4,0,0,0,4.105,3.091,5,5,0,0,0,0,8v7a5.006,5.006,0,0,0,5,5h6v2H8a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2H13V20h6a5.006,5.006,0,0,0,5-5V8A5,5,0,0,0,19.9,3.091ZM13,3.531a1,1,0,0,1,.725-.961l1.725-.493A2,2,0,0,1,18,4V7.938a2.006,2.006,0,0,1-1.45,1.921L13,10.873ZM6.8,2.4A1.993,1.993,0,0,1,8.55,2.077l1.725.493A1,1,0,0,1,11,3.531v7.342L7.45,9.859A2.006,2.006,0,0,1,6,7.938V4A1.987,1.987,0,0,1,6.8,2.4ZM22,15a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V8A3,3,0,0,1,4,5.184V7.938a4.014,4.014,0,0,0,2.9,3.845l3.451.987a6.019,6.019,0,0,0,3.3,0l3.451-.987A4.014,4.014,0,0,0,20,7.938V5.184A3,3,0,0,1,22,8Z" fill={fill}/>
      </svg>
    </div>
  );
}

export default LibraryIcon;
