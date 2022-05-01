import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderSignedOut.scss';
import logo from "../../assets/graphics/recbo-logo.svg";

const HeaderSignedOut = () => {

  return (
    <header className="HeaderSignedOut">
      <img src={logo} alt="Recbo Logo" />
      <Link to="/login"><button>Login / Sign Up</button></Link>
    </header>
  );
}

export default HeaderSignedOut;
