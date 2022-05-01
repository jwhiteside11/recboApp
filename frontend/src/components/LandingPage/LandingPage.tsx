import React, { useState, useMemo } from 'react';
import './LandingPage.scss';

import HeaderSignedOut from '../HeaderSignedOut/HeaderSignedOut';
import Footer from '../Footer/Footer';
import SortDropdown from '../SortDropdown/SortDropdown';
import SearchIcon from '../svgFCs/SearchIcon';
import { Link } from 'react-router-dom';
import InputBar from '../InputBar/InputBar';

const LandingPage = () => {
  const [searchContent, setSearchContent] = useState('')

  return (
    <div className="LandingPage">
      <HeaderSignedOut />

      <div className="landing-body">
        <div className="welcome">
          <h1>Welcome to Recbo!</h1>
          <h2>A better way to find and share recipes</h2>
        </div>

        <h1>Create</h1>
        <div className="sample-outer">
          <div></div>
          <div></div>
        </div>
        <h2>Create recipes for everyone to see, or just for you!</h2>

        <h1>Share</h1>
        <div className="sample-outer">
          <div></div>
          <div></div>
        </div>
        <h2>Share your creations with family and friends</h2>

        <h1>Discover</h1>
        <div className="sample-outer">
          <div></div>
          <div></div>
        </div>
        <h2>Discover new recipes that you might like</h2>

        <p>For access to our full suite of services, create a <Link to="/sign-up">free account</Link> today!</p>
        
        
        <div className="find-wrap">
          <h1>Find Recipes</h1>
          <SortDropdown options={useMemo(() => ['Relevance', 'Newest First', 'Oldest First', 'Cook Count'], [])} />
        </div>

        <div className="search-input">
          <InputBar placeholder="Search..." data={searchContent} setter={setSearchContent} />
        </div>

        <div className="search-placeholder">
          <SearchIcon size="96" fill="#BEBEBE"/>
          <h2>Search for recipes by name</h2>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;
