import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './RecipePage.scss';
import { Recipe, User } from '../../types';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { RouteState } from '../../redux/routes/routeSlice';
import RecipeDetails from '../RecipeDetails/RecipeDetails';
import RecipeInstructions from '../RecipeInstructions/RecipeInstructions';
import RecipeIngredients from '../RecipeIngredients/RecipeIngredients';
import { useAppDispatch } from '../../redux/hooks';
import { goToRecipeView, LayoutState, resetRecipePage, setBackViewHeight, setDetailsViewHeight, setFlipDegrees, setFrontViewHeight, setIngredientsViewHeight, setInstructionsViewHeight, setNewScrollTop, setRecipeHeaderButtonsShown, setRecipePageOnFront, setViewElemHeight, setViewHeightAndScroll } from '../../redux/layout/layoutSlice';
import useCheckRef from '../../hooks/useCheckRef';
import { ActionCreatorWithPayload, PayloadAction } from '@reduxjs/toolkit';
import useSetTitle from '../../hooks/useSetTitle';
import { UserState } from '../../redux/user/userSlice';
import EditRecipe from '../EditRecipe/EditRecipe';

type RecipePageProps = {
  routeInfo: RouteState,
  user: UserState,
  layout: LayoutState,
  bodyRef: React.MutableRefObject<HTMLDivElement | null>
}

type FlipDriver = {
  enterOffset: number;
  enterHeight: number;
  exitOffset: number;
  exitHeight: number;
  loaded: boolean;
}

type MountDriver = {
  minHeight: number;
  driving: boolean;
}

const RecipePage = ({routeInfo, user, layout, bodyRef}: RecipePageProps) => {
  // Initializers
  const minHeight = useMemo(() => layout.mainLayout.scrollWindowHeight - 192, [layout.mainLayout.scrollWindowHeight])
  const flipDimInit = useMemo(() => {
    return {
      enterOffset: 0,
      enterHeight: 0,
      exitOffset: 0,
      exitHeight: 0,
      loaded: false
    }
  }, [])
  const mountDriverInit = useMemo(() => {
    return {
      minHeight,
      driving: false
    }
  }, [minHeight])
  // View elem refs
  const frontRef = useRef<HTMLDivElement | null>(null)
  const backRef = useRef<HTMLDivElement | null>(null)
  // View elems
  const details: JSX.Element = useMemo(() => <div className="ref-wrap"><RecipeDetails /></div>, [])
  const instructions: JSX.Element = useMemo(() => <div className="ref-wrap"><RecipeInstructions /></div>, [])
  const ingredients: JSX.Element = useMemo(() => <div className="ref-wrap"><RecipeIngredients /></div>, [])
  // Local state
  const [viewDriver, setViewDriver] = useState<('details' | 'instructions' | 'ingredients')>('details')
  const [frontContent, setFrontContent] = useState<JSX.Element | null>(details)
  const [backContent, setBackContent] = useState<JSX.Element | null>(null)
  const [frontTop, setFrontTop] = useState<number>(0)
  const [backTop, setBackTop] = useState<number>(0)
  const [localViewElemHeight, setLocalViewElemHeight] = useState<number>(minHeight)
  const [localFlipperHeight, setLocalFlipperHeight] = useState<number>(minHeight)
  const [localFlipDeg, setLocalFlipDeg] = useState<number>(0)
  const [flipDriver1, setFlipDriver1] = useState<FlipDriver>(flipDimInit)
  const [flipDriver2, setFlipDriver2] = useState<FlipDriver>(flipDimInit)
  const [mountDriver1, setMountDriver1] = useState<MountDriver>(mountDriverInit)
  const [mountDriver2, setMountDriver2] = useState<MountDriver>(mountDriverInit)
  const [heightSmooth, setHeightSmooth] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [flipping, setFlipping] = useState<boolean>(false)
  // Vars
  const recipeID = useMemo(() => routeInfo.route.slice(8), [routeInfo.route]);
  const recipe = useMemo(() => user.user.recipes.find(rec => rec.recipeID === recipeID) ?? user.user.recipes[0], [recipeID, user.user.recipes]);
  const flipperOffset = useMemo(() => localFlipperHeight - minHeight, [localFlipperHeight, minHeight])
  const flipperOffsetTop = useMemo(() => flipDriver2 ? (bodyRef.current?.scrollTop ?? 0): 0 , [flipDriver2, bodyRef])
  const flipperOffsetBottom = useMemo(() => flipperOffset - flipperOffsetTop, [flipperOffset, flipperOffsetTop])
  // Reused fns
  const dispatch = useAppDispatch()
  const checkRef = useCheckRef()
  // Handlers
  const copyLinkText = () => {
    navigator.clipboard.writeText(recipe.link);
  }
  // Effects
  // On mount, set observers to guage size of each view 
  useEffect(() => {
    // Observer fn
    const observeViewHeight: (ref: React.MutableRefObject<HTMLDivElement | null>, setter: ActionCreatorWithPayload<number>) => ResizeObserver = (ref, setter) => {
      const minHeight = layout.mainLayout.scrollWindowHeight - 64

      const observer = new ResizeObserver((obj) => {
        dispatch(setter(Math.max(obj[0].contentRect.height, minHeight)))
      })
      if (ref && ref.current) {
        observer.observe(ref.current)
      }
      return observer
    }
    // Observe front and back height
    const frontObserver = observeViewHeight(frontRef, setFrontViewHeight)
    const backObserver = observeViewHeight(backRef, setBackViewHeight)
    // Clean-up
    return () => {
        frontObserver.disconnect()
        backObserver.disconnect()
    }
  }, [layout.mainLayout.scrollWindowHeight, frontContent, backContent, dispatch])
  // Set view height to match height observed by ref ResizeObservers
  useEffect(() => {
    if (loaded) return;
    // Set elem view height based on observer values
    if (layout.recipePage.flipDegrees % 360 === 0) {
      setLocalViewElemHeight(layout.recipePage.frontViewHeight)
    } else {
      setLocalViewElemHeight(layout.recipePage.backViewHeight)
    }
  }, [loaded, layout.recipePage.flipDegrees, layout.recipePage.frontViewHeight, layout.recipePage.backViewHeight, dispatch])
  // On mount (or route change), reset flip degrees vars
  useEffect(() => {
    console.log("MOUNTING RECIPE PAGE")
    const resetPage = () => {
      dispatch(resetRecipePage())
      setFrontContent(details)
    }

    resetPage()
    setMountDriver1({minHeight, driving: true})
  }, [minHeight, routeInfo.route, bodyRef, details, dispatch])

  useEffect(() => {
    if (!mountDriver1.driving) return;
    console.log("DRIVEN MOUNT 1", frontRef?.current?.scrollHeight)
    setViewElemHeight(frontRef?.current?.scrollHeight ?? mountDriver1.minHeight)
    setMountDriver2(mountDriver1)
    setLoaded(true)
  }, [mountDriver1])

  useEffect(() => {
    if (!mountDriver2.driving) return;
    console.log("DRIVEN MOUNT 2")
    setLoaded(true)
  }, [mountDriver2])

  /* FLIP EFFECTS */
  // On change to cache flipDegrees, update localFlipDeg
  useEffect(() => {
    console.log('flip deg changed', layout.recipePage.flipDegrees)
    setLocalFlipDeg(layout.recipePage.flipDegrees)
  }, [layout.recipePage.flipDegrees])
  // Effect 0
  useEffect(() => {
    console.log("effect 0")
    const view = layout.recipePage.view
    // Set front/back content to match cached view 
    const setViewContent = () => {
      const options = { details, ingredients, instructions }
      if (layout.recipePage.onFront) {
        setFrontContent(options[view])
      } else {
        setBackContent(options[view])
      }
    }

    const setDrivers = () => {
      setViewDriver(view)
      setFlipping(true)
    }
    
    setViewContent()
    // Drive effect 1
    setDrivers()
  }, [layout.recipePage.view, layout.recipePage.onFront, details, ingredients, instructions])
  
  // Effect 1
  useEffect(() => {
    if (!loaded || !flipping) return;
    console.log("effect 1")
    const onFront: boolean = layout.recipePage.flipDegrees % 360 === 0
    // Find heights and offsets for elems entering and leaving
    const getDriver: () => FlipDriver = () => {
      let enterH: number, enterO: number, exitH: number, exitO: number;
      enterH = enterO = exitH = 0
      exitO = layout.mainLayout.currentScrollTop
      if (onFront) { // on front
        if (checkRef(frontRef)) {
          enterH = Math.max(minHeight, frontRef.current?.scrollHeight ?? 0)
        }
        if (checkRef(backRef)) {
          exitH = Math.max(minHeight, backRef.current?.scrollHeight ?? 0)
        }
      } else {                                         // on back
        if (checkRef(frontRef)) {
          enterH = Math.max(minHeight, backRef.current?.scrollHeight ?? 0)
        }
        if (checkRef(backRef)) {
          exitH = Math.max(minHeight, frontRef.current?.scrollHeight ?? 0)
        }
      }
      if (viewDriver === 'details') {
        enterO = layout.recipePage.detailsView.offset
      } else if (viewDriver === 'instructions') {
        enterO = layout.recipePage.instructionsView.offset
      } else {
        enterO = layout.recipePage.ingredientsView.offset
      }

      const driver = {
        enterHeight: enterH,
        enterOffset: enterO,
        exitHeight: exitH,
        exitOffset: exitO,
        loaded: loaded
      }
      return driver
    }
    // Set height and top of view elem; set up flip animation to respect cached scroll height
    const setInstantHeightAndScroll = (driver: FlipDriver) => {
      // Set animation dur to none
      setHeightSmooth(false)
      // Set view elem height to instant height, set newScrollTop to match element shift (inverse action)
      const tempHeight = driver.enterOffset + driver.exitHeight - driver.exitOffset
      setLocalViewElemHeight(tempHeight)
      setLocalFlipperHeight(tempHeight)
      // Move exiting elem to match change in height, set flipDimensions to trigger next part of effect
      if (onFront) {
        setBackTop(driver.enterOffset - driver.exitOffset)
        setFrontTop(0)
      } else {
        setFrontTop(driver.enterOffset - driver.exitOffset)
        setBackTop(0)
      }
    }

    const driver = getDriver()
    setInstantHeightAndScroll(driver)
    // Drive next effect
    setFlipDriver1(driver)
  }, [viewDriver, loaded, flipping, minHeight, layout.recipePage, layout.mainLayout.currentScrollTop, bodyRef, checkRef, dispatch])
  // Effect 2
  useEffect(() => {
    if (!flipDriver1.loaded) return;
    console.log("effect 2")
    // Scroll to approriate offset when height changes
    const scrollToCachedOffset = () => {
      if (bodyRef && bodyRef.current) {
        bodyRef.current.scroll(0, flipDriver1.enterOffset)
      }
    }

    scrollToCachedOffset()
    // Drive next effect
    setFlipDriver2(flipDriver1)
  }, [flipDriver1, bodyRef])
  // Effect 3
  useEffect(() => {
    if (!flipDriver2.loaded) return;
    console.log("effect 3")
    // Set view elem height to entering elem height with smooth animation
    const finalFlipEffect = () => {
      // Set animation dur to normal
      setHeightSmooth(true)
      // Set view elem height to entering elem height
      setLocalViewElemHeight(flipDriver2.enterHeight)
      setLocalFlipperHeight(flipDriver2.enterHeight)
      // Toggle off effect 1
      setFlipping(false)
    }

    finalFlipEffect()
  }, [flipDriver2, bodyRef, dispatch])

  return (
    <div className="RecipePage">
      { layout.recipePage.editingRecipe ? 
      <EditRecipe recipe={recipe}/> :
      <div className="recipe-wrap" style={{ height: localViewElemHeight, transition: `${heightSmooth ? 0.5: 0}s height ease`, minHeight }}>
        <div className="perspective">
          <div className="flipper" style={{transform: `rotateY(${loaded ? localFlipDeg: 0}deg)`, height: minHeight, marginTop: flipperOffsetTop, marginBottom: flipperOffsetBottom}}>
            <div className="front" ref={frontRef} style={{top: frontTop - flipperOffsetTop}}>
              { frontContent }
            </div>
            <div className="back" ref={backRef} style={{top: backTop - flipperOffsetTop}}>
              { backContent }
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user, layout: state.layout}})(RecipePage);
