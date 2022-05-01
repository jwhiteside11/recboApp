import React, { useMemo } from 'react';
import { MorphPath } from '../../types';
import MorphPathIcon from './MorphPathIcon';
import './svgFCstyles.scss';

type MovingArrowIconProps = {
  fill: string,
  size: number,
  arrowIsUp: boolean | null
  thin?: boolean
}

const MovingArrowIcon = ({ fill, size, arrowIsUp, thin = false }: MovingArrowIconProps) => {

  const pathUp: string = "M4 22L14.002 10.6934C14.798 9.79358 16.202 9.79358 16.998 10.6934L27 22";
  const pathDown: string = "M4 9L14.002 20.3066C14.798 21.2064 16.202 21.2064 16.998 20.3066L27 9";
  const strokeWidth = Math.floor(size / 4) + 1
  const paths: MorphPath[] = useMemo(() => [{
    pathA: pathDown,
    pathB: pathUp,
    stroke: fill,
    strokeWidth: thin ? strokeWidth / 3: strokeWidth,
  }], [fill, thin, strokeWidth])
  
  return (
    <MorphPathIcon paths={paths} size={size} morphed={arrowIsUp} duration="0.12s" />
  );
}

export default MovingArrowIcon;
