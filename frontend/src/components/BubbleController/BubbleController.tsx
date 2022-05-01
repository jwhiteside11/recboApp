import React, { useMemo, useCallback } from 'react';
import { MorphPath } from '../../types';
import MorphPathIcon from '../svgFCs/MorphPathIcon';
import './BubbleController.scss';

type BubbleControllerProps = {
  adding: boolean,
  deleting: boolean,
  addSetter: React.Dispatch<React.SetStateAction<boolean>>,
  deleteSetter: React.Dispatch<React.SetStateAction<boolean>>
}

const BubbleController = ({adding, deleting, addSetter, deleteSetter}: BubbleControllerProps) => {
  
  const xPathL: string = "M13.7353 13.7453L5.25 5.26001";
  const xPathR: string = "M13.7353 5.25471L5.25 13.74";
  const plusPathR: string = "M9.5 3.5L9.5 15.5";
  const plusPathL: string = "M15.5 9.5L3.5 9.5";
  const checkPathL: string = "M8 13L4 10";
  const checkPathR: string = "M15 4L8 13";

  const getPath: (path: string, stroke: string, width: number, left: boolean) => MorphPath = useCallback((path, stroke, width, left) => {
    return {
      pathA: path,
      pathB: left ? checkPathL : checkPathR,
      stroke: stroke,
      strokeWidth: width
    }
  }, [])

  const getPathL: (path: string, stroke: string, width: number) => MorphPath = useCallback((path, stroke, width) => {
    return getPath(path, stroke, width, true)
  }, [getPath])
  const getPathR: (path: string, stroke: string, width: number) => MorphPath = useCallback((path, stroke, width) => {
    return getPath(path, stroke, width, false)
  }, [getPath])

  const xPaths: MorphPath[] =
    useMemo(() => [ 
      getPathL(xPathL, "#3C3C3C", 5),
      getPathR(xPathR, "#3C3C3C", 5)
    ], [getPathL, getPathR])

  const plusPaths: MorphPath[] =
    useMemo(() => [ 
      getPathL(plusPathL, "#F9F1E7", 5),
      getPathR(plusPathR, "#F9F1E7", 5)
    ], [getPathL, getPathR])

  
  const toggleDeleting = () => {
    if (adding) return;
    deleteSetter(!deleting);
  }

  const toggleAdding = () => {
    if (deleting) return;
    addSetter(!adding);
  }

  return (
    <div className="BubbleController">
      <div className={`bubble-btn ${deleting ? 'active': ''} ${adding ? 'faded': ''}`} onClick={toggleDeleting} style={{backgroundColor: "#F9F1E7"}}>
        <MorphPathIcon paths={xPaths} size={18} morphed={deleting} duration="0.2s" viewbox="0 0 19 19" />
      </div>
      <div className={`bubble-btn ${adding ? 'active': ''} ${deleting ? 'faded': ''}`} onClick={toggleAdding} style={{backgroundColor: "#3C3C3C"}}>
        <MorphPathIcon paths={plusPaths} size={18} morphed={adding} duration="0.2s" viewbox="0 0 19 19" />
      </div>
    </div>
  );
}

export default BubbleController;
