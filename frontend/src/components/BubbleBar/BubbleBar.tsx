import React, { useRef, useEffect, useState } from 'react';
import CheckIcon from '../svgFCs/CheckIcon';
import './BubbleBar.scss';

type BubbleBarProps = {
  placeholder: string,
  data: string,
  setter: (s: string) => void,
  onSubmit: () => void
}

const BubbleBar = ({placeholder, data, setter, onSubmit}: BubbleBarProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const psuedoRef = useRef<HTMLSpanElement | null>(null)
  const placeholderRef = useRef<HTMLSpanElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)
  const [minWidth, setMinWidth] = useState<number>(16)

  // Input data onChange handler
  const handleChange = (event: { target: { value: string; }; }) => {
    setter(event.target.value);
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      console.log(data)
      onSubmit()
    }
  }

  // On mount, focus input, get width of placeholder on mount, cache and use as min width for input
  useEffect(() => {
    if (placeholderRef && placeholderRef.current) {
      setMinWidth(placeholderRef.current.clientWidth)
    }
  }, [inputRef, placeholderRef])



  // Use cached min width, set input width and show element
  useEffect(() => {
    if (inputRef && inputRef.current && minWidth) {
      inputRef.current.style.width = minWidth + 'px'
      inputRef.current.focus()
    }
    if (outerRef && outerRef.current) {
      outerRef.current.style.visibility = 'visible'
    }
  }, [inputRef, minWidth])

  // On changes to input data, reflect change in width and hide/show placeholder
  useEffect(() => {
    // Input width
    if (inputRef && inputRef.current && psuedoRef && psuedoRef.current) {
      inputRef.current.style.width = Math.max(minWidth, psuedoRef.current.clientWidth) + 'px'
    }
    // Hide/show placeholder
    if (placeholderRef && placeholderRef.current) {
      if (data) {
        placeholderRef.current.style.visibility ='hidden'
      } else {
        placeholderRef.current.style.visibility ='visible'
      }
    }
  }, [data, minWidth, inputRef, placeholderRef])

  return (
    <div className="BubbleBar" ref={outerRef}>
      <span className="placeholder" ref={placeholderRef}>{placeholder}</span>
      <span ref={psuedoRef} id="psuedo">{data}</span>
      <input value={data} onChange={handleChange} onKeyDown={handleKeyDown} ref={inputRef}/>
      { data &&
      <div className="complete" onClick={onSubmit}>
        <CheckIcon fill="#3C3C3CD0" size={14} />
      </div>
      }
    </div>
  );
}

export default BubbleBar;
