import React, { useEffect, useState, useMemo, useCallback }  from 'react';
import './SliderBar.scss';
import DetailsIcon from '../svgFCs/DetailsIcon';
import ProfileIcon from '../svgFCs/ProfileIcon';
import { IconProps } from '../../types';

type SliderBarProps = {
  icons: (({ fill, size }: IconProps) => JSX.Element)[],
  slideIdx: number,
  setSlideIdx: React.Dispatch<React.SetStateAction<number>>,
  fillColor?: string,
  backgroundColor?: string
}

const SliderBar = ({icons, slideIdx, setSlideIdx, fillColor = "#3C3C3C", backgroundColor = "white"}: SliderBarProps) => {
  const [slidePos, setSlidePos] = useState<number>(0);
  const [iconElemsBGR, setIconElemsBGR] = useState<JSX.Element[]>([])
  const [iconElemsFGR, setIconElemsFGR] = useState<JSX.Element[]>([])
  const smallSize: string = "14"
  const outerWidth: number = useMemo(() => icons.length * (32) + icons.length - 1, [icons]);

  // On mount, initialize icons
  // Be sure to also wrap icons in a useMemo hook
  useEffect(() => {
    console.log("ONCE ONLY")
    const bgElems: JSX.Element[] = []
    const fgElems: JSX.Element[] = []
    icons.forEach((Icon, i) => bgElems.push(<div key={"bg-icon" + i} onClick={() => setSlideIdx(i)}>{Icon({fill: fillColor, size: smallSize})}</div>));
    icons.forEach((Icon, i) => fgElems.push(<div key={"fg-icon" + i}>{Icon({fill: backgroundColor, size: smallSize})}</div>));
    setIconElemsBGR(bgElems)
    setIconElemsFGR(fgElems)
  }, [icons, setSlideIdx, fillColor, backgroundColor])

  // Reflect changes to slideIdx from parent in slidePos (SliderBar state variable)
  useEffect(() => {
    let newPos: number = slideIdx * 33 - 1
    setSlidePos(newPos)
  }, [slideIdx])

  const styles = {backgroundColor: backgroundColor, '--outerWidth': `${outerWidth}px`} as React.CSSProperties 

  return (
    <div className="SliderBar" style={styles}>
      <div className="slider-bkgd">
        { iconElemsBGR }
      </div>
      
      <div className="slider-window" style={{transform: `translateX(${slidePos}px)`}}>
        <div className="slider-frgd" style={{transform: `translateX(${-1 * slidePos}px)`, backgroundColor: fillColor}}>
          { iconElemsFGR }
        </div>
      </div>
    </div>
  );
}

export default SliderBar;
