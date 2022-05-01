import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import './LoginLayout.scss'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { LayoutState, LoginViewOptions, resetLoginLayout, setLoginCurrentScrollTop, setMainScrollTop, setNewScrollTop, setSignUpSucceeded } from '../../redux/layout/layoutSlice';
import { changeRouteStateHistory, changeRouteStateNoHistory, getQueryParam, RouteState } from '../../redux/routes/routeSlice';
import { logInAndSetTokens, setLoggedIn, setTokens } from '../../redux/user/userSlice'
import { RootState } from '../../redux/store';
import { User, UserNewAccountInfo } from '../../types';
import Footer from '../Footer/Footer';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import { useAppDispatch } from '../../redux/hooks';
import useMapRouteToTitle from '../../hooks/useMapRouteToTitle';
import Checkbox from '../svgFCs/Checkbox/Checkbox';
import LargeButton from '../LargeButton/LargeButton';
import { sendLoginData, sendSignUpData, sendVerificationEmail } from '../../recboAPIClient';
import { UserState } from '../../redux/user/userSlice';
import LoginSignUpPage from '../LoginSignUpPage/LoginSignUpPage';
import logo from "../../assets/graphics/recbo-logo.svg";
import InputBar from '../InputBar/InputBar';

type LoginLayoutProps = {
  routeInfo: RouteState,
  userState: UserState,
  layout: LayoutState
}

const LoginLayout = ({routeInfo, userState, layout}: LoginLayoutProps) => {
  const bodyRef = useRef<HTMLDivElement | null>(null)
  
  const [activeView, setActiveView] = useState<LoginViewOptions>('login')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [createAccountLoading, setCreateAccountLoading] = useState<boolean>(false)
  const [createAccountSuccess, setCreateAccountSuccess] = useState<boolean>(false)

  const history = useHistory()
  const dispatch = useAppDispatch()
  const mapRouteToTitle = useMapRouteToTitle()

  // Handle vertical scroll events
  const handleScroll = useCallback(() => {
    if (bodyRef && bodyRef.current) {
      dispatch(setLoginCurrentScrollTop(bodyRef.current.scrollTop))
    }
  }, [bodyRef, dispatch])

  const submitData = () => {
    setCreateAccountLoading(true)

    const sendData = () => {
      const emailToken = getQueryParam(routeInfo.queryParams, "token") as string
      if (!emailToken) {
        // TODO validate email token
        console.log("must provide email token as query parameter")
        return
      }
  
      if (password !== passwordConfirm) {
        console.log("provided passwords do not match")
        return
      }
  
      const newUser: UserNewAccountInfo = {
        emailToken,
        username,
        password
      }
  
      console.log("creating new user", newUser)
  
      sendSignUpData(emailToken, username, password).then(res => {
        console.log("sign up data sent", res)
        const credentials = res.data.credentials
        if (credentials && credentials.requestToken && credentials.refreshToken) {
          setCreateAccountSuccess(true)
          dispatch(logInAndSetTokens({requestToken: credentials.requestToken, refreshToken:  credentials.refreshToken}))
          history.push("/library")
        }
      })
    }

    sendData()
    setCreateAccountLoading(false)
  }

  // Reflect change in cached view to subcomponent
  useEffect(() => {
    const path = routeInfo.route.slice(1)
    if (!(path === 'login' || path === 'sign-up' || path === 'complete-sign-up')) {
      return
    }
    const view: LoginViewOptions = path as LoginViewOptions
    console.log("LOGIN VIEW CHANGED", view)
    const route = `/${view}`
    const title = mapRouteToTitle(route, userState.user.username)
    dispatch(changeRouteStateNoHistory(route, title))
    setActiveView(view)
  }, [routeInfo.route, userState.user.username, mapRouteToTitle, dispatch])

  useEffect(() => {
    console.log("SCROLLING", console.log(bodyRef?.current?.scrollTop))
    bodyRef?.current?.scroll({top: 0})
  }, [layout.loginLayout.signUpSuccess, dispatch])

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
    if (!bodyRef?.current || bodyRef.current.scrollTop === layout.loginLayout.newScrollTop) return;
    console.log("PROGRAMMATIC SCROLL TO", layout.loginLayout.newScrollTop, "in window of size", bodyRef.current.scrollHeight)
    bodyRef?.current?.scroll({top: layout.loginLayout.newScrollTop})
  }, [layout.loginLayout.newScrollTop])

  // Reset cache on component dismount
  useEffect(() => {
    return () => {
      dispatch(resetLoginLayout())
    }
  }, [dispatch])

  
  return (
    <div className="LoginLayout" ref={bodyRef}>
      <div className="login-wrap">
        <div className="login-top">
          <Link to="/"><img src={logo} alt="Recbo logo" /></Link>
        </div>
        { activeView === 'complete-sign-up' ? 
        <div className='complete-sign-up'>
          <h2>Your email has been verified!</h2>
          <p>Choose a username and password below to create your Recbo account.</p>
          <InputBar placeholder="Username..." data={username} setter={setUsername} />
          <InputBar placeholder="Password..." data={password} setter={setPassword} type="password" />
          <InputBar placeholder="Reenter password..." data={passwordConfirm} setter={setPasswordConfirm} type="password" />

          <LargeButton text="Sign Up" onClick={submitData} loading={createAccountLoading}></LargeButton>
        </div> :
        <LoginSignUpPage activeView={activeView}/>
        }
      </div>
      <Footer />
    </div>
  )
}

export default connect((state: RootState) => { return {routeInfo: state.routes, userState: state.user, layout: state.layout}})(LoginLayout);
