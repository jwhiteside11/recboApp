import React, { useState, useEffect } from 'react';
import './FeedPage.scss';
import { User } from '../../types';
import { userJDW } from '../../globals';
import RecipeStackable from '../RecipeStackable/RecipeStackable';

const FeedPage = () => {
  const [stackElems, setStackElems] = useState<JSX.Element[]>([]);
  const user: User = userJDW;

  useEffect(() => {
    const elems: JSX.Element[] = []
    user.recipes.forEach(recipe => elems.push(<RecipeStackable recipe={recipe} key={recipe.name}/>))
    setStackElems(elems)
    console.log(user.recipes[0])
  }, [user])

  return (
    <div className="FeedPage">
      { stackElems }
    </div>
  );
}

export default FeedPage;
