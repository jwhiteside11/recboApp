import React from 'react';
import './svgFCstyles.scss';

type UndoIconProps = {
  fill: string,
  size: string
}
const UndoIcon = ({ fill, size }: UndoIconProps) => {
  return (
    <div  className="svgFC"style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.41309 3.49268C20.812 2.49268 21.812 19.029 9.06613 19.029C7.1032 19.029 5.31201 18.4927 3.81201 17.4927C2.31201 16.4927 4.31201 13.9927 5.31201 14.4927C6.31201 14.9927 6.81201 15.7118 8.76174 15.7118C14.088 15.7118 15.4911 8.31793 8.59651 8.31793L8.59651 10.8093L1.8118 5.99267L8.41309 0.992684L8.41309 3.49268Z" stroke={fill} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default UndoIcon;