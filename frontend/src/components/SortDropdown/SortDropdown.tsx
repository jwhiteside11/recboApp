import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './SortDropdown.scss';
import SortIcon from '../svgFCs/SortIcon';
import MovingArrowIcon from '../svgFCs/MovingArrowIcon';
import useOnClickOutside from '../../hooks/useOnClickOutside';

type SortDropdownProps = {
  options: string[]
}

const SortDropdown = ({options}: SortDropdownProps) => {
  const [activeOption, setActiveOption] = useState('')
  const [arrowIsUp, setArrowIsUp] = useState<boolean | null>(null)
  const [shown, setShown] = useState(false)
  const ref = useRef(null)
  
  const optionComps: JSX.Element[] = [];

  useEffect(() => {
    console.log("changed")
    setActiveOption(options[0]);
  }, [options]);

  const toggleShown = useCallback(() => {
    if (arrowIsUp === null) {
      setArrowIsUp(true);
    } else {
      setArrowIsUp(!arrowIsUp)
    }
    setShown(!shown)
  }, [arrowIsUp, shown])
  
  const setOption = (option: string) => {
    setActiveOption(option)
    toggleShown()
  }
  
  useOnClickOutside(ref, toggleShown, shown)


  options.forEach(opt => {
    optionComps.push(
    <div key={opt} className="sort-opt" onClick={() => setOption(opt)}>
      <div className="hover-tab"></div>
      <span>{opt}</span>
    </div>
    )
  });

  return (
    <div className="SortDropdown" ref={ref}>
      <div id="sdd-control">
        <SortIcon size="24" fill="#3C3C3C" />
        <button onClick={toggleShown}>
          <span>{activeOption}</span>
          <MovingArrowIcon size={14} fill="#3C3C3C" arrowIsUp={arrowIsUp}/>
        </button>
      </div>
      { shown &&
      <div id="sdd-options">
        {optionComps}
      </div> 
      }
    </div>
  );
}

export default SortDropdown;
