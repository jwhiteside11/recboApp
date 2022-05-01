import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { LayoutState, setSliderWindowHeight } from '../../redux/layout/layoutSlice';
import './SliderWindow.scss'

type SliderWindowProps = {
  children: React.ReactNode
  slideIdx: number,
  setSlideIdx: React.Dispatch<React.SetStateAction<number>>,
  // Redux props
  layout: LayoutState
}

const SliderWindow = ({children, slideIdx, setSlideIdx, layout}: SliderWindowProps) => {
  const [sliderPos, setSliderPos] = useState<number>(0)
  const [allComponents, setAllComponents] = useState<JSX.Element[]>([])
  const [childWraps, setChildWraps] = useState<(HTMLDivElement | null)[]>([])
  const dispatch = useAppDispatch()

  const childrenElems = useMemo(() => {
    const childrenWrappers: (HTMLDivElement | null)[] = []
    const childrenElems: JSX.Element[] = []
    React.Children.forEach(children, (child) => {
      childrenElems.push(<div ref={(ref) => childrenWrappers.push(ref)}>{child}</div>)
    })
    setChildWraps(childrenWrappers)
    return childrenElems
  }, [children])

  const windowStyle = {'height': layout.sliderWindow.windowHeight} as React.CSSProperties

  useEffect(() => {
    console.log("INDEX CHANGED")
    const newPos = slideIdx * 100
    setSliderPos(newPos)
    const child: HTMLDivElement | null = childWraps[slideIdx]
    if (child && child.scrollHeight) {
      dispatch(setSliderWindowHeight(child.scrollHeight))
    }
  }, [slideIdx, childWraps, dispatch])

  useEffect(() => {
    console.log("CHILD-WRAPS", childWraps)
    childWraps.forEach(elem => console.log(elem?.scrollHeight))
  }, [childWraps])

  return (
    <div className="SliderWindow" style={windowStyle}>
      <div className="perpet">
        <div className="inner-slider" style={{transform: `translateX(-${sliderPos}vw)`}}>
          {childrenElems}
        </div>
      </div>
    </div>
  )
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user, layout: state.layout}})(SliderWindow);