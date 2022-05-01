import React from 'react';
import './svgFCstyles.scss';

type CommentsIconProps = {
  fill: string,
  size: string
}
const CommentsIcon = ({ fill, size }: CommentsIconProps) => {
  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.3182 1H3.68182L2.5 2.28V9.96L3.68182 11.24H8.40909L11.3636 17L14.3182 11.24L15.5 9.96V2.28L14.3182 1Z" stroke={fill} />
      <line x1="3.68164" y1="3.70001" x2="10.7725" y2="3.70001" stroke={fill} />
      <line x1="3.68164" y1="6.25995" x2="13.1362" y2="6.25995" stroke={fill} />
      <line x1="3.68164" y1="8.81998" x2="10.7725" y2="8.81998" stroke={fill} />
      </svg>
    </div>
  );
}

export default CommentsIcon;
