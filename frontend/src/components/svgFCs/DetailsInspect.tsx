import React from 'react';
import './svgFCstyles.scss';

type DetailsInspectProps = {
  fill: string,
  size: string
}
const DetailsInspect = ({ fill, size }: DetailsInspectProps) => {
  return (
    <div  className="svgFC"style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.3332 8C21.6868 8 22.0259 8.14048 22.276 8.39052C22.526 8.64057 22.6665 8.97971 22.6665 9.33333C22.6665 9.68696 22.526 10.0261 22.276 10.2761C22.0259 10.5262 21.6868 10.6667 21.3332 10.6667H10.6665C10.3129 10.6667 9.97374 10.5262 9.7237 10.2761C9.47365 10.0261 9.33317 9.68696 9.33317 9.33333C9.33317 8.97971 9.47365 8.64057 9.7237 8.39052C9.97374 8.14048 10.3129 8 10.6665 8H21.3332ZM31.6092 31.6093C31.3591 31.8593 31.0201 31.9997 30.6665 31.9997C30.313 31.9997 29.9739 31.8593 29.7238 31.6093L26.5145 28.4C25.5641 29.0066 24.4607 29.3303 23.3332 29.3333C22.1465 29.3333 20.9864 28.9814 19.9998 28.3222C19.0131 27.6629 18.244 26.7258 17.7899 25.6294C17.3358 24.5331 17.2169 23.3267 17.4485 22.1628C17.68 20.9989 18.2514 19.9298 19.0905 19.0907C19.9296 18.2516 20.9987 17.6801 22.1626 17.4486C23.3265 17.2171 24.5329 17.3359 25.6293 17.7901C26.7256 18.2442 27.6627 19.0132 28.322 19.9999C28.9813 20.9866 29.3332 22.1466 29.3332 23.3333C29.3302 24.4608 29.0064 25.5642 28.3998 26.5147L31.6092 29.724C31.8591 29.974 31.9996 30.3131 31.9996 30.6667C31.9996 31.0202 31.8591 31.3593 31.6092 31.6093ZM23.3332 26.6667C23.9924 26.6667 24.6369 26.4712 25.1851 26.1049C25.7332 25.7386 26.1605 25.218 26.4128 24.6089C26.6651 23.9999 26.7311 23.3296 26.6025 22.683C26.4738 22.0364 26.1564 21.4425 25.6902 20.9763C25.224 20.5101 24.6301 20.1927 23.9835 20.064C23.3369 19.9354 22.6666 20.0014 22.0576 20.2537C21.4485 20.506 20.9279 20.9333 20.5616 21.4814C20.1953 22.0296 19.9998 22.6741 19.9998 23.3333C19.9998 24.2174 20.351 25.0652 20.9761 25.6904C21.6013 26.3155 22.4491 26.6667 23.3332 26.6667ZM17.3332 29.3333H9.33317C8.27231 29.3333 7.25489 28.9119 6.50474 28.1618C5.7546 27.4116 5.33317 26.3942 5.33317 25.3333V6.66667C5.33317 5.6058 5.7546 4.58839 6.50474 3.83824C7.25489 3.08809 8.27231 2.66667 9.33317 2.66667H25.3332C25.6868 2.66667 26.0259 2.80714 26.276 3.05719C26.526 3.30724 26.6665 3.64638 26.6665 4V14.6667C26.6665 15.0203 26.807 15.3594 27.057 15.6095C27.3071 15.8595 27.6462 16 27.9998 16C28.3535 16 28.6926 15.8595 28.9426 15.6095C29.1927 15.3594 29.3332 15.0203 29.3332 14.6667V4C29.3332 2.93913 28.9117 1.92172 28.1616 1.17157C27.4115 0.421427 26.394 0 25.3332 0L9.33317 0C7.56571 0.00211714 5.87125 0.705176 4.62146 1.95496C3.37168 3.20474 2.66862 4.89921 2.6665 6.66667V25.3333C2.66862 27.1008 3.37168 28.7953 4.62146 30.045C5.87125 31.2948 7.56571 31.9979 9.33317 32H17.3332C17.6868 32 18.0259 31.8595 18.276 31.6095C18.526 31.3594 18.6665 31.0203 18.6665 30.6667C18.6665 30.313 18.526 29.9739 18.276 29.7239C18.0259 29.4738 17.6868 29.3333 17.3332 29.3333Z" fill={fill}/>
      </svg>
    </div>
  );
}

export default DetailsInspect;

