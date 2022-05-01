import React from 'react';
import './Footer.scss';
import SpatulaIcon from '../svgFCs/SpatulaIcon';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="Footer">
      <div>
        <span>&#169; John D. Whiteside 2021</span>
        <span>All rights reserved</span>
      </div>
      <SpatulaIcon fill="white" size="32"/>
      <div>
        <Link to="/">Terms of Service</Link>
        <Link to="/">Privacy Policy</Link>
      </div>
    </footer>
  );
}

export default Footer;
