import React, { useCallback, useEffect} from 'react';
import './ExplorePage.scss';

import { recipeList } from '../../globals';
import SmallCardCarousel from '../SmallCardCarousel/SmallCardCarousel';

const ExplorePage = () => {
  
  return (
    <div className="ExplorePage">
      <div className="explore-row">
        <SmallCardCarousel title={"Top picks for you"} recipes={recipeList.slice(0, 5)}/>
      </div>
      <div className="explore-row">
        <SmallCardCarousel title={"Taqueria"} recipes={recipeList.slice(0,8)}/>
      </div>
      <div className="explore-row">
        <SmallCardCarousel title={"Pasta Night"} recipes={recipeList}/>
      </div>
    </div>
  );
}

export default ExplorePage;
