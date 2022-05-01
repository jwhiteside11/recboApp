import React, { useState, useRef, useEffect } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import './InputBox.scss';

type InputBoxProps = {
  placeholder: string,
  data: string,
  setter: (s: string) => void,
}

const InputBox = ({placeholder, data, setter}: InputBoxProps) => {
  const [focused, setFocused] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
	const [textAreaHeight, setTextAreaHeight] = useState<string>("auto");
	const [parentHeight, setParentHeight] = useState<string>("auto");

  useEffect(() => {
    if (!data) {}
    const scrollHeight = inputRef?.current?.scrollHeight
    if (scrollHeight) {
      setParentHeight(`${scrollHeight + 18}px`)
      setTextAreaHeight(`${scrollHeight}px`)
    }
  }, [data])

  const handleChange = (event: { target: { value: string, scrollHeight: number}; }) => {
    const scrollHeight = inputRef?.current?.scrollHeight
    if (scrollHeight) {
      setParentHeight(`${scrollHeight + 18}px`)
      setTextAreaHeight(`auto`)
    }
    setter(event.target.value);
  }

  useOnClickOutside(ref, () => setFocused(false), focused)

  return (
    <div className={`InputBox ${focused ? 'focused': ''}`} ref={ref} style={{height: parentHeight}}>
      { !data && 
      <span>{placeholder}</span> }
      <textarea value={data} onChange={handleChange} onFocus={() => setFocused(true)} ref={inputRef} style={{height: textAreaHeight}} rows={1}/>
    </div>
  );
}

export default InputBox;
