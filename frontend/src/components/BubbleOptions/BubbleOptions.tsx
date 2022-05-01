import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import BubbleBar from '../BubbleBar/BubbleBar';
import BubbleController from '../BubbleController/BubbleController';
import InputBar from '../InputBar/InputBar';
import XIcon from '../svgFCs/XIcon';
import './BubbleOptions.scss';

type BubbleOptionsProps = {
  title: string,
  options: Array<string>
}

const BubbleOptions = ({title, options}: BubbleOptionsProps) => {
  const [deleting, setDeleting] = useState<boolean>(false)
  const [adding, setAdding] = useState<boolean>(false)
  const [activeOptions, setActiveOptions] = useState<string[]>([])
  const [input, setInput] = useState<string>('')

  const addInputToOptions: () => void = () => {
    if (!input) return;
    setActiveOptions([...activeOptions, input])
    setInput('')
  }

  const removeIFromActive: (i: number) => void = useCallback((i) => {
    if (!deleting) return;

    const len = activeOptions.length
    if (len === 0) return;
    const newOptions: string[] = []
    activeOptions.forEach((opt, j) => {if (i !== j) newOptions.push(opt)})
    setActiveOptions(newOptions)
  }, [activeOptions, deleting])

  const bubblePlaceholder: (title: string) => JSX.Element = (title) => {
    return (
      <div className="bubble-placeholder">
        No {title} listed
      </div>
    )
  }

  const bubbleElems: JSX.Element[] = useMemo(() => [...activeOptions].map((opt, i) => {
    return (
      <div className="bubble-wrap" key={opt + i}>
        {opt}
        <div onClick={() => removeIFromActive(i)}><XIcon fill="#3C3C3CD0" size="14" /></div>
      </div>
    )}), [activeOptions, removeIFromActive])

  // On mount, set activeOptions to options props value
  useEffect(() => {
    setActiveOptions(options)
  }, [options])

  return (
    <div className="BubbleOptions">
      <div className="upper-bar">
        <h3>{title}:</h3>
        <BubbleController adding={adding} addSetter={setAdding} deleting={deleting} deleteSetter={setDeleting} />
      </div>
      <div className={`bubble-contain ${deleting ? 'deleting': ''}`}>
        { bubbleElems.length > 0 &&
        bubbleElems }
        { adding && 
        <BubbleBar placeholder='...' data={input} setter={setInput} onSubmit={addInputToOptions}/>}
        { (bubbleElems.length === 0 && !adding) &&
        bubblePlaceholder(title.toLowerCase()) }
      </div>
    </div>
  );
}

export default BubbleOptions;
