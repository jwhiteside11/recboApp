import './LoginSignUpPage.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { emailInfoInvalid, loginInfoInvalid, sendLoginData, sendVerificationEmail } from "../../recboAPIClient";
import { useAppDispatch } from "../../redux/hooks";
import { LayoutState, LoginViewOptions, setSignUpSucceeded } from "../../redux/layout/layoutSlice";
import { changeRouteStateHistory, changeRouteStateNoHistory, RouteState } from "../../redux/routes/routeSlice";
import { RootState } from "../../redux/store";
import { setLoggedIn, setTokens, UserState } from "../../redux/user/userSlice";
import LargeButton from "../LargeButton/LargeButton";
import LoginPage from "../LoginPage/LoginPage";
import SignUpPage from "../SignUpPage/SignUpPage";
import Checkbox from "../svgFCs/Checkbox/Checkbox";
import ShakeButton from '../ShakeButton/ShakeButton';
import { v4 as uuidv4 } from 'uuid';

type LoginSignUpPageProps = {
  routeInfo: RouteState,
  userState: UserState,
  layout: LayoutState,
  activeView: LoginViewOptions
}

const LoginSignUpPage = ({routeInfo, userState, layout, activeView}: LoginSignUpPageProps) => {
  const loginRef = useRef<HTMLDivElement | null>(null)
  const signUpRef = useRef<HTMLDivElement | null>(null)

  const [loginViewHeight, setLoginViewHeight] = useState<number>(0)
  const [signUpViewHeight, setSignUpViewHeight] = useState<number>(0)
  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false)
  const [signUpLoading, setSignUpLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const loginBtnKey = useMemo(() => uuidv4(), [])
  const signUpBtnKey = useMemo(() => uuidv4(), [])

  const dispatch = useAppDispatch()
  const history = useHistory()

  const shakeLoginBtn = useCallback(() => {
    document.dispatchEvent(new Event("shake_" + loginBtnKey))
  }, [loginBtnKey])

  const shakeSignUpBtn = useCallback(() => {
    document.dispatchEvent(new Event("shake_" + signUpBtnKey))
  }, [signUpBtnKey])


  const submitLoginData = useCallback(() => {
    if (loginInfoInvalid(username, password)) {
      console.log(loginInfoInvalid(username, password))
      shakeLoginBtn()
      return
    }

    setLoginLoading(true)

    sendLoginData(username, password).then(res => {
      console.log(res)
      setLoginLoading(false)
      if (res.status !== 200) {
        return
      }
      dispatch(setLoggedIn(true))
      history.push("/library")
    }).catch(err => {
      console.log(err)
      setLoginLoading(false)
      shakeLoginBtn()
    })
  }, [dispatch, history, password, shakeLoginBtn, username])

  const submitSignUpData = useCallback(() => {
    console.log("SUBMITTING")
    if (emailInfoInvalid(email) !== "") {
      console.log("input invalid", emailInfoInvalid(email))
      shakeSignUpBtn()
      return
    }

    setSignUpLoading(true)
    sendVerificationEmail(email).then(res => {
      console.log(res)
      setSignUpLoading(false)
      if (res.status !== 200) {
        return
      }
      if (!res.data.token) {
        return
      }
      dispatch(setSignUpSucceeded())
    }).catch(err => {
      console.log(err)
      setSignUpLoading(false)
      shakeSignUpBtn()
    })
  }, [dispatch, email, shakeSignUpBtn])

  const goToLogin = () => {
    if (activeView === 'login') {
      submitLoginData()
    } else {
      dispatch(changeRouteStateNoHistory('/login'))
    }
  }

  const goToSignUp = () => {
    if (activeView === 'sign-up') {
      submitSignUpData()
    } else {
      dispatch(changeRouteStateNoHistory('/sign-up'))
    }
  }

  const loginView: JSX.Element = useMemo(() => <div className='view-wrap' ref={loginRef}><LoginPage username={username} setUsername={setUsername} password={password} setPassword={setPassword} submit={submitLoginData}/></div>, [password, submitLoginData, username])
  const signUpView: JSX.Element = useMemo(() => <div className='view-wrap' ref={signUpRef}><SignUpPage email={email} setEmail={setEmail} submit={submitSignUpData}/></div>, [email, submitSignUpData])

  // On mount, add observers to find real height
  useEffect(() => {
    // Observer fn
    const observeViewHeight: (ref: React.MutableRefObject<HTMLDivElement | null>, setter: React.Dispatch<React.SetStateAction<number>>) => ResizeObserver = (ref, setter) => {
      const observer = new ResizeObserver((obj) => {
        setter(obj[0].contentRect.height ?? 0)
      })
      if (ref && ref.current) {
        observer.observe(ref.current)
      }
      return observer
    }
    // Observe front and back height
    const loginObserver = observeViewHeight(loginRef, setLoginViewHeight)
    const signUpObserver = observeViewHeight(signUpRef, setSignUpViewHeight)
    // Clean-up
    return () => {
        loginObserver.disconnect()
        signUpObserver.disconnect()
    }
  }, [])

  return (
    <div className="LoginSignUpPage">
      { layout.loginLayout.signUpSuccess ? 
      <div className="sign-up-succeeded">
        <h2>Check your inbox!</h2>
        <div className="check-wrap">
          <Checkbox background="#D98D33" fill="#F9F1E7" size={72}/>
        </div>
        <p className="success">A verification email has been sent to <span className="bold">{email}</span>.</p>
        <p>Click the link to finish creating your Recbo account.</p>

        <hr/>
        <p className="didnt">Didn’t get an email including your verification link? Make sure that the email provided is correct!</p>
        <p>Click here to resend the email.</p>
      </div> :
      <>
        <h2>User Login</h2>
        <div className='view-window' style={{height: activeView === 'login' ? loginViewHeight + 24: 0}}>
        { loginView }
        </div>

        <ShakeButton btn={<LargeButton text="Sign In" onClick={goToLogin} loading={loginLoading}></LargeButton>} btnKey={loginBtnKey} />

        <hr/>

        <div className="new-to-wrap">
          <h2>New to Recbo?</h2>
          <p>Create a <Link to="/sign-up">free account</Link> today!</p>
        </div>

        <div className='view-window' style={{height: activeView === 'sign-up' ? signUpViewHeight: 0}}>
        { signUpView }
        </div>

        <ShakeButton btn={<LargeButton text="Sign Up" onClick={goToSignUp} loading={signUpLoading}></LargeButton>} btnKey={signUpBtnKey} />
      </>
      }
    </div>
  )
}

export default connect((state: RootState) => { return {routeInfo: state.routes, userState: state.user, layout: state.layout}})(LoginSignUpPage);