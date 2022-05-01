import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import './LibraryPage.scss';
import { RecipeMetaInfo } from '../../types';
import RecentIcon from '../svgFCs/RecentIcon';
import BookmarkIcon from '../svgFCs/BookmarkIcon';
import CreationIcon from '../svgFCs/CreationIcon';
import DraftIcon from '../svgFCs/DraftIcon';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { UserState } from '../../redux/user/userSlice';
import RecipeCard from '../RecipeCard/RecipeCard';
import { LayoutState } from '../../redux/layout/layoutSlice';
import ArrowIcon from '../svgFCs/ArrowIcon';
import MovingArrowIcon from '../svgFCs/MovingArrowIcon';

type LibraryPageProps = {
  user: UserState,
  layout: LayoutState
}

type SectionOptions = 'recent' | 'bookmark' | 'created' | 'draft';

type RecipeCardsListParams = {
  shown: number,
  setShown: React.Dispatch<React.SetStateAction<number>>,
  height: number, 
  ref: React.MutableRefObject<HTMLDivElement | null>,
  recipes: RecipeMetaInfo[],
  section: SectionOptions
}

const LibraryPage = ({user, layout}: LibraryPageProps) => {
  const [recentsShown, setRecentsShown] = useState<number>(0)
  const [bookmarkedShown, setBookmarkedShown] = useState<number>(0)
  const [creationsShown, setCreationsShown] = useState<number>(0)
  const [draftsShown, setDraftsShown] = useState<number>(0)

  const [recentsHeight, setRecentsHeight] = useState<number>(0)
  const [bookmarkedHeight, setBookmarkedHeight] = useState<number>(0)
  const [creationsHeight, setCreationsHeight] = useState<number>(0)
  const [draftsHeight, setDraftsHeight] = useState<number>(0)

  const recentlyViewedRef = useRef<HTMLDivElement | null>(null)
  const bookmarkedRef = useRef<HTMLDivElement | null>(null)
  const creationsRef = useRef<HTMLDivElement | null>(null)
  const draftsRef = useRef<HTMLDivElement | null>(null)

  const getMetaFromIDs: (ids: string[]) => RecipeMetaInfo[] = useCallback((ids) => {
    const info: RecipeMetaInfo[] = []
    ids.forEach((elem, i) => info.push(user.fetchCache.recipeMetaInfo.keyVals[elem] ?? user.user.recipes[0]))
    return info
  }, [user.fetchCache.recipeMetaInfo.keyVals, user.user.recipes])
  
  const recentlyViewed: RecipeMetaInfo[] = useMemo(() => getMetaFromIDs(user.library.recentlyViewed), [user.library.recentlyViewed, getMetaFromIDs])
  const bookmarked: RecipeMetaInfo[] = useMemo(() => getMetaFromIDs(user.library.bookmarked), [user.library.bookmarked, getMetaFromIDs])
  const creations: RecipeMetaInfo[] = useMemo(() => getMetaFromIDs(user.library.creations), [user.library.creations, getMetaFromIDs])
  const drafts: RecipeMetaInfo[] = useMemo(() => getMetaFromIDs(user.library.drafts), [user.library.drafts, getMetaFromIDs])

  /* Element fns */
  const recipeCards: ({shown, setShown, height, ref, recipes, section}: RecipeCardsListParams) => JSX.Element = useCallback(({shown, setShown, height, ref, recipes, section}) => {
    const len = recipes.length
    const numElemsShown = 4 * shown + 2
    const elems: JSX.Element[] = Array(numElemsShown)
    const maxInd = Math.ceil(Math.max(len - 2, 0) / 4) + 1

    for (let i = 0; i < numElemsShown && i < len; i++) {
      elems[i] = <div key={`${section + i}`}><RecipeCard recipe={recipes[i]} size='med' /></div>
    }

    return (
    <div className="recipe-sect">
      <div className="elem-window" style={{height: shown > 0 ? height: '164px'}}>
        <div className="inner-window" ref={ref}>
          { elems }
        </div>
      </div>
      { len > 2 ? 
      <div className="see-more" onClick={() => setShown((shown + 1) % maxInd)}>
        <MovingArrowIcon fill="#00000060" size={36} arrowIsUp={shown === maxInd - 1 ? true: false} thin={true}/>
      </div> :
      <div className="see-more-spacer"></div>
      }
    </div>
  )}, [])

  const recentCards: () => JSX.Element = useCallback(() => {
    const options: RecipeCardsListParams = {
      shown: recentsShown,
      setShown: setRecentsShown,
      height: recentsHeight,
      ref: recentlyViewedRef,
      recipes: recentlyViewed,
      section: 'recent'
    }

    return recipeCards(options)
  }, [recentlyViewed, recentsHeight, recentsShown, recipeCards])

  const bookmarkedCards: () => JSX.Element = useCallback(() => {
    const options: RecipeCardsListParams = {
      shown: bookmarkedShown,
      setShown: setBookmarkedShown,
      height: bookmarkedHeight,
      ref: bookmarkedRef,
      recipes: bookmarked,
      section: 'bookmark'
    }

    return recipeCards(options)
  }, [bookmarked, bookmarkedHeight, bookmarkedShown, recipeCards])

  const creationCards: () => JSX.Element = useCallback(() => {
    const options: RecipeCardsListParams = {
      shown: creationsShown,
      setShown: setCreationsShown,
      height: creationsHeight,
      ref: creationsRef,
      recipes: creations,
      section: 'created'
    }

    return recipeCards(options)
  }, [creations, creationsHeight, creationsShown, recipeCards])

  const draftCards: () => JSX.Element = useCallback(() => {
    const options: RecipeCardsListParams = {
      shown: draftsShown,
      setShown: setDraftsShown,
      height: draftsHeight,
      ref: draftsRef,
      recipes: drafts,
      section: 'draft'
    }

    return recipeCards(options)
  }, [drafts, draftsHeight, draftsShown, recipeCards])

  const sectionPlaceholder: (section: SectionOptions, text: string) => JSX.Element = useCallback((section, text) => {
    return (
    <div className="sect-placeholder">
      { section === 'recent' ? 
      <RecentIcon fill="#00000050" size="42" /> :
      ( section === 'bookmark' ? 
      <BookmarkIcon outerFill="#00000050" innerFill="00000000" size="42" /> :
      ( section === 'created' ? 
      <CreationIcon fill="#00000050" size="42" /> :
      ( section === 'draft' ? 
      <DraftIcon fill="#00000050" size="42" /> : null )))
      }
      <p>{ text }</p>
      <hr/>
    </div>
  )}, [])
  /* Effects */
  // On mount, set observers to guage size of each view 
  useEffect(() => {
    // Observer fn
    const observeViewHeight: (ref: React.MutableRefObject<HTMLDivElement | null>, setter: React.Dispatch<React.SetStateAction<number>>) => ResizeObserver = (ref, setter) => {
      const observer = new ResizeObserver((obj) => {
        setter(obj[0].contentRect.height)
      })
      if (ref && ref.current) {
        console.log("OBSERVED", ref)
        observer.observe(ref.current)
      } else {
        console.log("COULD NOT OBSERVE", ref)
      }
      return observer
    }
    // Observe front and back height
    const recentsObserver = observeViewHeight(recentlyViewedRef, setRecentsHeight)
    const bookmarkedObserver = observeViewHeight(bookmarkedRef, setBookmarkedHeight)
    const creationsObserver = observeViewHeight(creationsRef, setCreationsHeight)
    const draftsObserver = observeViewHeight(draftsRef, setDraftsHeight)
    // Clean-up
    return () => {
      recentsObserver.disconnect()
      bookmarkedObserver.disconnect()
      creationsObserver.disconnect()
      draftsObserver.disconnect()
    }
  }, [layout.mainLayout.scrollWindowHeight, recentlyViewed, bookmarked, creations, drafts])

  return (
    <div className="LibraryPage">
      <div className="lib-sect">
        <h1>Recently Viewed</h1>
        { recentlyViewed.length > 0 ? 
        recentCards() : 
        sectionPlaceholder('recent', "No recently viewed recipes") }
      </div>
      <div className="lib-sect">
        <h1>Bookmarked</h1>
        { bookmarked.length > 0 ? 
        bookmarkedCards() : 
        sectionPlaceholder('bookmark', "No bookmarked recipes") }
      </div>
      <div className="lib-sect">
        <h1>Creations</h1>
        { creations.length > 0 ? 
        creationCards() : 
        sectionPlaceholder('created', "You haven't created any recipes yet") }
      </div>
      <div className="lib-sect">
        <h1>Drafts</h1>
        { drafts.length > 0 ? 
        draftCards() : 
        sectionPlaceholder('draft', "You have no recipe drafts pending") }
      </div>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user, layout: state.layout}})(LibraryPage);
