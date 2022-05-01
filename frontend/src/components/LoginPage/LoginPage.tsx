import React, { Dispatch, SetStateAction, useState } from 'react';
import './LoginPage.scss';
import Footer from '../Footer/Footer';
import logo from "../../assets/graphics/recbo-logo.svg";
import InputBar from '../InputBar/InputBar';
import CheckIcon from '../svgFCs/CheckIcon';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { goToLoginView } from '../../redux/layout/layoutSlice';
import { changeRouteStateNoHistory } from '../../redux/routes/routeSlice';

type LoginPageProps = {
  username: string,
  setUsername: Dispatch<SetStateAction<string>>,
  password: string,
  setPassword: Dispatch<SetStateAction<string>>,
  submit: () => void
}

const LoginPage = ({username, setUsername, password, setPassword, submit}: LoginPageProps) => {
  const [remembered, setRemembered] = useState(false);

  const history = useHistory()
  const dispatch = useAppDispatch()

  const toggleRemembered = () => {
    setRemembered(!remembered)
  }

  const printRemembered = () => {
    console.log(remembered)
  }

  const doSignIn = () => {
    console.log(username)
    console.log(password)
    history.push('/explore')
    printRemembered()
  }

  return (
    <div className="LoginPage">
      <div className="login-body">
        <InputBar placeholder="Username..." data={username} setter={setUsername} />
        <InputBar placeholder="Password..." data={password} setter={setPassword} type="password" onReturn={submit}/>
        
        <div onClick={toggleRemembered} className="remember-wrap">
          <div>
            { remembered && 
            <CheckIcon fill="#3C3C3C" size={18} /> }
          </div>
          <span>Remember me!</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
