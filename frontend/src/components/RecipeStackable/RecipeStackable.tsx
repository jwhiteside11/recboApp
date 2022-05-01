import React from 'react';
import { useHistory } from 'react-router';
import EditIcon from '../svgFCs/EditIcon';
import DetailsIcon from '../svgFCs/DetailsIcon';
import ShareIcon from '../svgFCs/ShareIcon';
import './RecipeStackable.scss';
import BookmarkIcon from '../svgFCs/BookmarkIcon';
import { Recipe } from '../../types';
import SpatulaIcon from '../svgFCs/SpatulaIcon';
import CommentsIcon from '../svgFCs/CommentsIcon';
import { useAppDispatch } from '../../redux/hooks';
import { changeRouteStateHistory } from '../../redux/routes/routeSlice';

type RecipeStackableProps = {
  recipe: Recipe
}

const RecipeStackable = ({recipe}: RecipeStackableProps) => {
  const dispatch = useAppDispatch();

  const copyLinkText = () => {
    navigator.clipboard.writeText(recipe.link);
  }

  const goToAuthorProfile: () => void = () => {
    dispatch(changeRouteStateHistory(`/profile/${recipe.user.username}`, recipe.user.displayName + ' | User Profile'));
  }

  const goToRecipe: () => void = () => {
    dispatch(changeRouteStateHistory(`/recipe/${recipe.recipeID}`, recipe.name + ' | Recbo'));
  }

  return (
    <div className="RecipeStackable">
      <div className="stack-header">
        <div onClick={goToAuthorProfile}>
          <div>
            <img src={recipe.user.image} alt=''/>
          </div>
          <h4>{recipe.user.displayName}</h4>
        </div>
        <div>
          <SpatulaIcon fill="#3C3C3C" size="18" />
          <h4>x {recipe.cookCount}</h4>
        </div>
      </div>

      <div className="stack-body">
        <div className="img-display">

        </div>

        <div className="b-right">
          <div className="name-contain" onClick={goToRecipe}>  
            <h3>{recipe.name}</h3>
            <hr/>
          </div>

          <div className="icon-button-contain">
            <div className="icon-button">
              <BookmarkIcon outerFill="#3C3C3C" innerFill="#00000000" size="14"/>
            </div>
            <div className="icon-button" onClick={copyLinkText}>
              <ShareIcon fill="#3C3C3C" size="14"/>
            </div>
            <div className="icon-button" style={{padding: '8px 7px 6px'}}>
              <CommentsIcon fill="#3C3C3C" size="16"/>
            </div>
            <div className="icon-button" onClick={goToRecipe}>
              <DetailsIcon fill="#3C3C3C" size="14"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeStackable;
