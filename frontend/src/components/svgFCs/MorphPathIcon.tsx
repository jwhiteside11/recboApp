import React, { useEffect, useRef, useState } from 'react';
import { MorphPath } from '../../types';
import './svgFCstyles.scss';

type MorphPathIconProps = {
  paths: MorphPath[],
  size: number,
  duration: string,
  morphed: boolean | null,
  viewbox?: string
}

interface SVGAnimationElement extends SVGAnimateElement {
  beginElement(): SVGElement;
}

const MorphPathIcon = ({ paths, size, duration, morphed, viewbox = "0 0 31 31" }: MorphPathIconProps) => {
  const aRef = useRef<(SVGAnimationElement | null)[]>([])
  const bRef = useRef<(SVGAnimationElement | null)[]>([])
  const [svgElems, setSVGElems] = useState<JSX.Element[]>([])

  // On mount, load in svg paths to inline svg
  useEffect(() => {
  if (!aRef || !aRef.current || !bRef || !bRef.current) return; 
  const elems: JSX.Element[] = []

  paths.forEach(path => {
    elems.push(
    <path d={path.pathA} stroke={path.stroke} strokeWidth={path.strokeWidth} strokeLinecap="round" key={`svgMorphElem ${path.pathA.slice(0,3)} ${path.pathB.slice(0,3)}`}>
      <animate attributeName="d" from={path.pathA} to={path.pathB} dur={duration} ref={(ref) => {aRef.current.push(ref as SVGAnimationElement)}} fill="freeze" begin="indefinite" />
      <animate attributeName="d" from={path.pathB} to={path.pathA} dur={duration} ref={(ref) => {bRef.current.push(ref as SVGAnimationElement)}} fill="freeze" begin="indefinite" />
    </path>)
  });
  console.log(elems)
  console.log(aRef.current)
  setSVGElems(elems);
  }, [paths, aRef, bRef, duration])

  // Use animation on toggle
  useEffect(() => {
    if (aRef && aRef.current && morphed) {
      aRef.current.forEach(ref => ref?.beginElement());
    } else if (bRef && bRef.current && morphed === false) {
      bRef.current.forEach(ref => ref?.beginElement());
    }
  }, [morphed, aRef, bRef])

  return (
    <div className="svgFC" style={{width: size + "px", height: size + "px"}}>
      <svg preserveAspectRatio="xMidYMid meet" viewBox={viewbox} fill="none" xmlns="http://www.w3.org/2000/svg">
      { svgElems }
      </svg>
    </div>
  );
}

export default MorphPathIcon;
