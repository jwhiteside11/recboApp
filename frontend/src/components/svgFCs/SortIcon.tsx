import React from 'react';
import './svgFCstyles.scss';

type SortIconProps = {
  fill: string,
  size: string
}
const SortIcon = ({ fill, size }: SortIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6h13a1 1 0 000-2H10a1 1 0 000 2zm13 5H10a1 1 0 000 2h13a1 1 0 000-2zm0 7H10a1 1 0 000 2h13a1 1 0 000-2zM6.087 6a.5.5 0 00.353-.854L4 2.707a1 1 0 00-1.414 0L.147 5.146A.5.5 0 00.5 6h1.794v12H.5a.5.5 0 00-.354.854l2.44 2.439a1 1 0 001.414 0l2.44-2.439A.5.5 0 006.087 18H4.294V6z" fill={fill}/>
      </svg>
    </div>
  );
}

export default SortIcon;
