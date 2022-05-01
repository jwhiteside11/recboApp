import React, { useState, useRef } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import './InputBar.scss';

type InputBarProps = {
  placeholder: string,
  data: string,
  setter: (s: string) => void,
  type?: string,
  onReturn?: () => void
}

const InputBar = ({placeholder, data, setter, type, onReturn}: InputBarProps) => {
  const [focused, setFocused] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const handleChange = (event: { target: { value: string; }; }) => {
    setter(event.target.value);
  }

  const handleKeyUp = (event: { key: string }) => {
    if (onReturn !== undefined && event.key === "Enter") {
      onReturn()
    }
  }

  useOnClickOutside(ref, () => setFocused(false), focused)

  return (
    <div className={`InputBar ${focused ? 'focused': ''}`} ref={ref}>
      { !data && 
      <span>{placeholder}</span> }
      { type === 'password' ? 
      <input className="password" value={data} type="password" onChange={handleChange} onFocus={() => setFocused(true)} onKeyUp={handleKeyUp} /> :
      <input value={data} onChange={handleChange} onFocus={() => setFocused(true)} onKeyUp={handleKeyUp} /> }
    </div>
  );
}

export default InputBar;
