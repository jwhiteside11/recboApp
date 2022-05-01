import React from 'react';
import './svgFCstyles.scss';

type SearchIconProps = {
  fill: string,
  size: string
}
const SearchIcon = ({ fill, size }: SearchIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.707 22.293l-5.969-5.969a10.016 10.016 0 10-1.414 1.414l5.969 5.969a1 1 0 001.414-1.414zM10 18a8 8 0 118-8 8.009 8.009 0 01-8 8z" fill={fill}/>
      </svg>
    </div>
  );
}

export default SearchIcon;
