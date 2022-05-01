import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import Footer from '../Footer/Footer';
import logo from '../../assets/graphics/recbo-logo.svg'
import './MainLayout.scss';
import { Link, useHistory, useLocation } from 'react-router-dom';
import SearchPage from '../SearchPage/SearchPage';
import ExplorePage from '../ExplorePage/ExplorePage';
import FeedPage from '../FeedPage/FeedPage';
import LibraryPage from '../LibraryPage/LibraryPage';
import SearchIcon from '../svgFCs/SearchIcon';
import PlusSignIcon from '../svgFCs/PlusSignIcon';
import GlobeIcon from '../svgFCs/GlobeIcon';
import FeedIcon from '../svgFCs/FeedIcon';
import LibraryIcon from '../svgFCs/LibraryIcon';
import ProfileIcon from '../svgFCs/ProfileIcon';
import SettingsIcon from '../svgFCs/SettingsIcon';
import MenuIcon from '../svgFCs/MenuIcon';
import ProfilePage from '../ProfilePage/ProfilePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import { User } from '../../types';
import useSetTitle from '../../hooks/useSetTitle';
import SignOutIcon from '../svgFCs/SignOutIcon';
import useOnClickOutside from '../../hooks/useOnClickOutside';

import { changeRouteStateNoHistory, changeRouteStateHistory, RouteState } from '../../redux/routes/routeSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import RecipePage from '../RecipePage/RecipePage';
import ProfileHOC from '../ProfileHOC/ProfileHOC';
import { goToRecipeView, goToRecipeViewAsync, LayoutState, setFlipDegrees, setMainScrollTop, setScrollWindowHeight } from '../../redux/layout/layoutSlice';
import DetailsIcon from '../svgFCs/DetailsIcon';
import OrderedListIcon from '../svgFCs/OrderedListIcon';
import ListIcon from '../svgFCs/ListIcon';
import useMapRouteToTitle from '../../hooks/useMapRouteToTitle';
import { clearAllUserData, setLoggedIn, UserState } from '../../redux/user/userSlice';
import EditRecipe from '../EditRecipe/EditRecipe';
import { emptyRecipe } from '../../globals';

type MainLayoutProps = {
  userState: UserState,
  routeInfo: RouteState,
  layout: LayoutState
}

const MainLayout = ({userState, routeInfo, layout}: MainLayoutProps) => {
  const [menuShown, setMenuShown] = useState(false);
  const [profileShown, setProfileShown] = useState(false);
  const [activeSubcomponent, setActiveSubcomponent] = useState<JSX.Element | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const profileBtnRef = useRef<HTMLDivElement | null>(null)
  const menuBtnRef = useRef<HTMLButtonElement | null>(null)
  const [menuWhitelist, setMenuWhitelist] = useState<(HTMLElement | null)[]>([])
  const [profileWhitelist, setProfileWhitelist] = useState<(HTMLElement | null)[]>([])
  const location = useLocation();
  const history = useHistory();

  /* Hooks */
  // Reused fns
  const dispatch = useAppDispatch()
  const mapRouteToTitle = useMapRouteToTitle()
  const hideMenu = useCallback(() => {
    if (menuShown) {
      setMenuShown(false)
    }
  }, [menuShown])

  const signOut = useCallback(() => {
    dispatch(clearAllUserData())
  }, [dispatch])

  const hideProfile = useCallback(() => {
    if (profileShown) {
      setProfileShown(false)
    }
  }, [profileShown])
  // Hook that closes menu on outside click
  useOnClickOutside(menuRef, hideMenu, menuShown, menuWhitelist)
  // Hook that closes profile dropdown on outside click
  useOnClickOutside(dropdownRef, hideProfile, profileShown, profileWhitelist)
  
  /* Handler functions */
  const toggleMenuShown = useCallback(() => {
    if (profileShown) {
      console.log('profileShown')
      setTimeout(() => { setProfileShown(false) }, 50)
      setMenuShown(true)
    } else {
      setMenuShown(!menuShown)
    }
  }, [menuShown, profileShown])
  
  const toggleProfileShown = useCallback(() => {
    if (menuShown) {
      setTimeout(() => { setProfileShown(true) }, 50)
      setMenuShown(false)
    } else {
      setProfileShown(!profileShown)
    }
  }, [menuShown, profileShown])

  const mapRouteToComponent: (route: string) => void = useCallback((route) => {
    console.log("MAPPING ROUTE", route)
    const path = route.split("/")[1]

    if (path === 'search') {
      setActiveSubcomponent(<SearchPage />)
    } else if (path === 'explore') {
      setActiveSubcomponent(<ExplorePage />)
    } else if (path === 'feed') {
      setActiveSubcomponent(<FeedPage />)
    } else if (path === 'library') {
      setActiveSubcomponent(<LibraryPage />)
    } else if (path === `settings` || path === 'profile') {
      setActiveSubcomponent(<ProfileHOC />)
    } else if (path === `recipe`) {
      setActiveSubcomponent(<RecipePage bodyRef={bodyRef}/>)
    } else if (path === `create`) {
      setActiveSubcomponent(<EditRecipe />)
    }
  }, [])

  const hideMenuAndProfile: () => void = useCallback(() => {
    // Close menu/profile dropdown
    setMenuShown(false)
    setProfileShown(false)
    // Else, replace state of browser window
  }, [])

  // If current page clicked, just scroll to top and return true; else do nothing, return false
  const scrollToTopIfSame: (route: string) => boolean = useCallback((route) => {
    console.log("changing route", routeInfo.route, 'to', route)
    if (route === routeInfo.route) {
      console.log("SAME")
      bodyRef?.current?.scroll({top: 0, behavior: 'smooth'});
      return true;
    } 
    return false;
  }, [routeInfo.route])
  
  const goToRoute: (route: string, withHistory: boolean) => void = useCallback((route, withHistory) => {
    hideMenuAndProfile()
    if (scrollToTopIfSame(route)) return;

    const title = mapRouteToTitle(route, userState.user.username)
    dispatch(withHistory ? changeRouteStateHistory(route, title): changeRouteStateNoHistory(route, title))
  }, [mapRouteToTitle, userState.user.username, scrollToTopIfSame, hideMenuAndProfile, dispatch])

  // Handle vertical scroll events
  const handleScroll = useCallback(() => {
    if (bodyRef && bodyRef.current) {
      dispatch(setMainScrollTop(bodyRef.current.scrollTop))
    }
  }, [bodyRef, dispatch])
  // Function for creating side menu item
  const menuItem: (name: string, route: string, component: JSX.Element) => JSX.Element= useCallback((name, route, component) => {
    return (
      <div onClick={() => goToRoute(route, true /* ** OLD ** routeInfo.route.slice(0, 7) === '/recipe' */ )}>
        { component }
        <h1>{ name }</h1>
      </div>
    )
  }, [goToRoute])
  // Function for creating buttons 
  const recipeNavButton: (view: 'details' | 'instructions' | 'ingredients', icon: JSX.Element) => JSX.Element = useCallback((view, icon) => {
    return (
      <div className="icon-button" onClick={() => dispatch(goToRecipeViewAsync(view, view === 'details' ? 180: -180))}>
        { icon }
      </div>
    )
  }, [dispatch])
  /* Effects */
  // On route change, change activeSubcomponent
  useEffect(() => {
    console.log("route change detected", routeInfo.route)
    mapRouteToComponent(routeInfo.route)
  }, [routeInfo.route, mapRouteToComponent])

  // On change to activeSubcomponent, scroll view window to top
  useEffect(() => {
    if (activeSubcomponent === null) return;
    console.log('active subcomponent change')
    bodyRef?.current?.scroll({top: 0});
  }, [activeSubcomponent, bodyRef])

  // On mount, add scroll listener to dispatch scrollHeight
  useEffect(() => {
    const div: HTMLDivElement | null = bodyRef?.current
    if (!div) return;

    div.addEventListener('scroll', handleScroll)
    return () => {
      div.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, bodyRef]);

  // On change to newScrollHeight, perform scroll
  useEffect(() => {
    if (!bodyRef?.current || bodyRef.current.scrollTop === layout.mainLayout.newScrollTop) return;
    console.log("PROGRAMMATIC SCROLL TO", layout.mainLayout.newScrollTop, "in window of size", bodyRef.current.scrollHeight)
    bodyRef?.current?.scroll({top: layout.mainLayout.newScrollTop})
  }, [layout.mainLayout.newScrollTop])

  // On mount, set whitelists for useOnClickOutside hooks
  useEffect(() => {
    const menuBtn = menuBtnRef?.current
    if (menuBtn) {
      setMenuWhitelist([menuBtn])
    }
    const profileBtn = profileBtnRef?.current
    if (profileBtn) {
      setProfileWhitelist([profileBtn])
    }
  }, [menuBtnRef, profileBtnRef, layout.mainLayout.recipeHeaderButtonsShown])

  useEffect(() => {
    const observer = new ResizeObserver((elem) => {
      dispatch(setScrollWindowHeight(elem[0].target.clientHeight))
    })
    if (bodyRef && bodyRef.current) {
      observer.observe(bodyRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [dispatch])

  return (
    <div className="MainLayout">

      <div className="main-header">
        { !layout.mainLayout.recipeHeaderButtonsShown ?
        <button onClick={toggleMenuShown} ref={menuBtnRef}>
          <MenuIcon fill="white" size="32" />
        </button> :
        recipeNavButton('details', <DetailsIcon fill="white" size="18" />)
        }

        <img src={logo} alt="Recbo logo" />

        { layout.recipePage.view === 'details' ?
        <div className="profile-btn" onClick={toggleProfileShown} ref={profileBtnRef}>
          <div className="btn-inner"></div>
        </div> :
        ( layout.recipePage.view === 'ingredients' ?
        recipeNavButton('instructions', <OrderedListIcon fill="white" size="18" />) :
        recipeNavButton('ingredients', <ListIcon fill="white" size="18" />) )
        }
      </div>

      <div className="profile-outer">
        <div className={`profile-dropdown ${profileShown ? "slide-profile": ""}`} ref={dropdownRef}>
          <div className="dropdown-opts">
            { useMemo(() => [
              menuItem('Profile', `/profile/${userState.user.username}`, <ProfileIcon fill="#3C3C3C" size="20" />),
              menuItem('Settings', '/settings', <SettingsIcon fill="#3C3C3C" size="20" />),
              <div onClick={() => signOut()}>
                <SignOutIcon fill="#3C3C3C" size="20" />
                <h1>Sign Out</h1>
              </div>
            ], [menuItem, userState.user.username, signOut])}
          </div>
        </div>
      </div>
      
      <div className={`side-menu ${menuShown ? "menu-open": ""}`} ref={menuRef}>
        { useMemo(() => [
          menuItem('Create', '/create', <PlusSignIcon fill="white" size="18" />),
          menuItem('Search', '/search', <SearchIcon fill="white" size="18" />),
          menuItem('Library', '/library', <LibraryIcon fill="white" size="20" />),
          // menuItem('Explore', '/explore', <GlobeIcon fill="white" size="20" />),
          // menuItem('Feed', '/feed', <FeedIcon fill="white" size="20" />),
        ], [menuItem]) }
      </div>

      
      <div className={`main-body ${menuShown ? "pushed": ""}`} ref={bodyRef}>
        <div className='subcomponent-outer'>
          <div className={`subcomponent-wrap`}>
            {activeSubcomponent}
          </div>
          <Footer />
        </div>
      </div>

    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, userState: state.user, layout: state.layout}})(MainLayout);
