import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import './SmallCardCarousel.scss';

import { Recipe } from '../../types'

import ArrowIcon from '../svgFCs/ArrowIcon';
import RecipeCard from '../RecipeCard/RecipeCard';

type SmallCardCarouselProps = {
  title: string,
  recipes: Recipe[]
}

const SmallCardCarousel = ({title, recipes}: SmallCardCarouselProps) => {
  const [cardTuples, setCardTuples] = useState<JSX.Element[]>([])
  const [controlBlocks, setControlBlocks] = useState<JSX.Element[]>([])
  const [activeInd, setActiveInd] = useState<number>(0)
  const [sliderLeftVW, setSliderLeftVW] = useState<number>(0)
  const ref = useRef<HTMLDivElement | null>(null)
  
  const lenCards = recipes.length
  const tupleWidth = 70
  const maxLeft = lenCards === 0 ? 0: -(lenCards % 2 === 0 ? lenCards / 2 - 1 : Math.floor(lenCards / 2)) * tupleWidth
  
  // On mount, get RecipeCard components from user recipe data
  const cardElems = useMemo<JSX.Element[]>(() => {
    const elems = []
    for (let recipe of recipes) {
      elems.push(<RecipeCard recipe={recipe} />)
    }
    return elems;
  }, [recipes])

  // Set tuples and control blocks according to changes in activeInd
  useEffect(() => {
    const tuples = []
    const blocks = []
    for (let i = 0; i < cardElems.length; i += 2) {
      tuples.push(
        <div key={'tuple' + i + title.slice(0, 5)} className={`tuple-contain ${activeInd === i / 2 ? "tuple-display": ""}`}>
          { cardElems[i] }
          { i + 1 < cardElems.length && cardElems[i + 1]}
        </div>
      )
      blocks.push(
        <div key={'block' + i + title.slice(0, 5)} className={`block ${activeInd === i / 2 ? "display-block": ""}`} onClick={() => changeView(Math.floor(i / 2))}></div>
      )
    }
    setCardTuples(tuples)
    setControlBlocks(blocks)

  }, [activeInd, cardElems, ref, title])

  const changeView: (idx: number) => void = (idx) => {
    let posX = -(idx * tupleWidth)
    setActiveInd(idx)
    setSliderLeftVW(posX)
  }

  const handleControlTouch: (e: React.TouchEvent) => void = (e) => {
    const touch = e.touches[0]
    const controlBoundBox = ref?.current?.getBoundingClientRect()
    if (!touch || !controlBoundBox) return;

    if (touch.pageX <= controlBoundBox.x) {
      changeView(0)
    } else if (touch.pageX >= controlBoundBox.x + controlBoundBox.width) {
      changeView(cardTuples.length - 1)
    } else {
      const newInd = Math.floor((touch.pageX - controlBoundBox.x) / 24)
      changeView(newInd)
    }
  }

  const touchStart: (e: React.TouchEvent) => void = (e) => {
    handleControlTouch(e)
  }
  
  const touchMove: (e: React.TouchEvent) => void = (e) => {
    handleControlTouch(e)
  }

  const moveSlider: (dx: number) => void = (dx) => {
    let newX = sliderLeftVW + dx
    if (newX > 0) {
      newX = maxLeft
    } else if (newX < maxLeft) {
      newX = 0
    }
    setSliderLeftVW(newX)
  }

  const moveLeft : () => void = () => {
    moveSlider(tupleWidth)
    const newInd = activeInd === 0 ? cardTuples.length - 1: activeInd - 1
    setActiveInd(newInd)
  }

  const moveRight : () => void = () => {
    moveSlider(-tupleWidth)
    const newInd = activeInd === cardTuples.length - 1 ? 0: activeInd + 1
    setActiveInd(newInd)
  }

  const styles = {'--blockCount': recipes.length % 2  === 0 ? recipes.length / 2: Math.ceil(recipes.length / 2)} as React.CSSProperties
  
  return (
    <div className="SmallCardCarousel" style={styles}>
      <h3>{title}</h3>

      <div className="carousel-contain">

        <div className="l-btn" onClick={moveLeft}>

        </div> 

        <div className="slider" style={{left: `${sliderLeftVW}vw`}}>
          { cardTuples }
        </div>

        <div className="r-btn" onClick={moveRight}>

        </div>

      </div>

        <div className="control" onTouchStart={touchStart} onTouchMove={touchMove} ref={ref}>
          { controlBlocks }
        </div>
    </div>
  );
}

export default SmallCardCarousel;
