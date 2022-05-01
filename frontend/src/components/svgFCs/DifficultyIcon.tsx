import React, { useRef, useCallback, useEffect } from 'react';
import { SVGAnimationElement } from '../../types';
import './svgFCstyles.scss';

type DifficultyIconProps = {
  fill: string,
  size: number,
  level: 'easy' | 'med' | 'hard'
}

const DifficultyIcon = ({ fill, size, level }: DifficultyIconProps) => {
  const smallRef = useRef<SVGAnimationElement | null>(null)
  const bigRef = useRef<SVGAnimationElement | null>(null)
  const medRef = useRef<SVGAnimationElement | null>(null)

  const startAnimation = (ref: React.MutableRefObject<SVGAnimationElement | null>) => {
    if (ref && ref.current) {
      console.log("STARTING ANIMATION")
      ref.current.beginElement()
    }
  }

  const startAll = useCallback(() => {
    setTimeout(() => {
      startAnimation(smallRef)
      setTimeout(() => {
        startAnimation(medRef)
        setTimeout(() => {
          startAnimation(bigRef)
        }, 300)
      }, 300)
    }, 200)
  }, [])

  useEffect(() => {
    startAll()
  }, [startAll])

  const duration: number =  0.4

  // Paths
  const smallOuter: string = "M2 7.92653C1.46957 7.92653 0.96086 8.13725 0.585787 8.51232C0.210714 8.88739 0 9.3961 0 9.92653V14.0001C0 14.5305 0.210714 15.0392 0.585787 15.4143C0.96086 15.7894 1.46957 16.0001 2 16.0001C2.53043 16.0001 3.03914 15.7894 3.41421 15.4143C3.78929 15.0392 4 14.5305 4 14.0001V9.92653C4 9.3961 3.78929 8.88739 3.41421 8.51232C3.03914 8.13725 2.53043 7.92653 2 7.92653ZM2.66667 14.0001C2.66667 14.1769 2.59643 14.3464 2.47141 14.4715C2.34638 14.5965 2.17681 14.6667 2 14.6667C1.82319 14.6667 1.65362 14.5965 1.52859 14.4715C1.40357 14.3464 1.33333 14.1769 1.33333 14.0001V9.92653C1.33333 9.74972 1.40357 9.58015 1.52859 9.45513C1.65362 9.3301 1.82319 9.25986 2 9.25986C2.17681 9.25986 2.34638 9.3301 2.47141 9.45513C2.59643 9.58015 2.66667 9.74972 2.66667 9.92653V14.0001Z";
  const medOuter: string = "M8 4C7.46957 4 6.96086 4.21071 6.58579 4.58579C6.21071 4.96086 6 5.46957 6 6V14.0001C6 14.5305 6.21071 15.0392 6.58579 15.4143C6.96086 15.7893 7.46957 16.0001 8 16.0001C8.53043 16.0001 9.03914 15.7893 9.41421 15.4143C9.78929 15.0392 10 14.5305 10 14.0001V6C10 5.46957 9.78929 4.96086 9.41421 4.58579C9.03914 4.21071 8.53043 4 8 4ZM8.66667 14.0001C8.66667 14.1769 8.59643 14.3464 8.47141 14.4715C8.34638 14.5965 8.17681 14.6667 8 14.6667C7.82319 14.6667 7.65362 14.5965 7.52859 14.4715C7.40357 14.3464 7.33333 14.1769 7.33333 14.0001V6C7.33333 5.82319 7.40357 5.65362 7.52859 5.5286C7.65362 5.40357 7.82319 5.33333 8 5.33333C8.17681 5.33333 8.34638 5.40357 8.47141 5.5286C8.59643 5.65362 8.66667 5.82319 8.66667 6V14.0001Z";
  const bigOuter: string = "M14 0C13.4696 0 12.9609 0.210714 12.5858 0.585786C12.2107 0.960859 12 1.46957 12 2V14C12 14.5304 12.2107 15.0391 12.5858 15.4142C12.9609 15.7893 13.4696 16 14 16C14.5304 16 15.0391 15.7893 15.4142 15.4142C15.7893 15.0391 16 14.5304 16 14V2C16 1.46957 15.7893 0.960859 15.4142 0.585786C15.0391 0.210714 14.5304 0 14 0ZM14.6667 14C14.6667 14.1768 14.5964 14.3464 14.4714 14.4714C14.3464 14.5964 14.1768 14.6667 14 14.6667C13.8232 14.6667 13.6536 14.5964 13.5286 14.4714C13.4036 14.3464 13.3333 14.1768 13.3333 14V2C13.3333 1.82319 13.4036 1.65362 13.5286 1.5286C13.6536 1.40357 13.8232 1.33333 14 1.33333C14.1768 1.33333 14.3464 1.40357 14.4714 1.5286C14.5964 1.65362 14.6667 1.82319 14.6667 2V14Z";

  const smallFillStart: string = "M3 15V15H1V15H3Z";
  const smallFillEnd: string = "M3 9V15H1V9H3Z";
  const medFillStart: string = "M9 15V15H7V15H9Z";
  const medFillEnd: string = "M9 5V15H7V5H9Z";
  const bigFillStart: string = "M15 15V15H13V15H15Z";
  const bigFillEnd: string = "M15 1V15H13V1H15Z";


  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={smallOuter} fill={fill} />
      <path d={medOuter} fill={fill} />
      <path d={bigOuter} fill={fill} />
      
      <path d={smallFillStart} fill={fill} >
        <animate attributeName="d" from={smallFillStart} to={smallFillEnd} dur={`${duration * 3 / 2}s`} ref={smallRef} fill="freeze" begin="indefinite" />
      </path>
      { (level === 'med' || level ==='hard') && 
        <path d={medFillStart} fill={fill}> 
          <animate attributeName="d" from={medFillStart} to={medFillEnd} dur={`${duration * 4 / 3}s`} ref={medRef} fill="freeze" begin="indefinite" />
        </path>
      }
      { level ==='hard' && 
      <path d={bigFillStart} fill={fill}> 
        <animate attributeName="d" from={bigFillStart} to={bigFillEnd} dur={`${duration}s`} ref={bigRef} fill="freeze" begin="indefinite" />
      </path>
      }
      </svg>
    </div>
  );
}

export default DifficultyIcon;
