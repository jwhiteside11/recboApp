import React, { useState, useEffect, useRef } from 'react';
import './RecipeDetails.scss';
import { Recipe, User, UserBlip } from '../../types';
import BookmarkIcon from '../svgFCs/BookmarkIcon';
import ShareIcon from '../svgFCs/ShareIcon';
import CommentsIcon from '../svgFCs/CommentsIcon';
import SpatulaIcon from '../svgFCs/SpatulaIcon';
import ProfileIcon from '../svgFCs/ProfileIcon';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { changeRouteStateHistory, RouteState } from '../../redux/routes/routeSlice';
import ListIcon from '../svgFCs/ListIcon';
import SortIcon from '../svgFCs/SortIcon';
import HourglassIcon from '../svgFCs/HourglassIcon';
import CalendarIcon from '../svgFCs/CalendarIcon';
import DifficultyIcon from '../svgFCs/DifficultyIcon';
import OrderedListIcon from '../svgFCs/OrderedListIcon';
import { useAppDispatch } from '../../redux/hooks';
import { goToRecipeView, goToRecipeViewAsync, LayoutState, setEditingRecipe, setFlipDegrees, setNewScrollTop } from '../../redux/layout/layoutSlice';
import useSetViewElemHeight from '../../hooks/useSetViewElemHeight';
import EditIcon from '../svgFCs/EditIcon';
import { addToBookmarked, addToRecentlyViewed, removeFromBookmarked, toggleUserRecipeBookmarked, UserState } from '../../redux/user/userSlice';

type RecipeDetailsProps = {
  routeInfo: RouteState,
  userState: UserState,
  layout: LayoutState
}

const RecipeDetails = ({routeInfo, userState, layout}: RecipeDetailsProps) => {
  // Initializers
  const user = userState.user
  const recipeID = routeInfo.route.slice(8);
  const recipe = user.recipes.find(rec => rec.recipeID === recipeID) ?? user.recipes[0]
  // Hooks
  const [bookmarked, setBookmarked] = useState<boolean>(recipe.bookmarked ?? false)
  const dispatch = useAppDispatch()
  // Vars
  const bannerImgStyle = {'background': `url('${recipe.images[0] ?? ''}')`} as React.CSSProperties
  // Handlers
  const copyLinkText = () => {
    navigator.clipboard.writeText(recipe.link);
  }

  const goToInstructions = () => {
    dispatch(goToRecipeViewAsync('instructions', -180))
  }

  const goToIngredients = () => {
    dispatch(goToRecipeViewAsync('ingredients', 180))
  }

  const toggleBookmarkRecipe = () => {
    if (recipe.bookmarked) {
      dispatch(removeFromBookmarked(userState.fetchCache.recipeMetaInfo.keyVals[recipeID]))
    } else {
      dispatch(addToBookmarked(userState.fetchCache.recipeMetaInfo.keyVals[recipeID]))
    }
    dispatch(toggleUserRecipeBookmarked(recipeID))
  }

  const editRecipe = () => {
    dispatch(setEditingRecipe(true))
  }

  useEffect(() => {
    dispatch(addToRecentlyViewed(recipe))
  }, [recipe, dispatch])
  
  return (
    <div className="RecipeDetails">

      <div className="recipe-name">
        <h1>{recipe.name}</h1>
      </div>

      { recipe.user.username === user.username &&
      <div className="icon-button edit-btn" onClick={editRecipe}>
        <EditIcon fill="#3C3C3C" size="18" />
      </div>
      }

      <div className="upper-info">
        <div className="info-bar" onClick={() => dispatch(changeRouteStateHistory(`/profile/${recipe.user.username}`, recipe.user.displayName + ' | User Profile'))}>
          <ProfileIcon fill="#3C3C3C" size="18" />
          <h2>{recipe.user.displayName}</h2>
        </div>
        <div className="info-bar">
          <CalendarIcon fill="#3C3C3C" size={18} />
          <h2>{recipe.datePublished}</h2>
        </div>
        <div className="info-bar">
          <HourglassIcon fill="#3C3C3C" size="18" />
          <h2>{recipe.timeEstimate}</h2>
        </div>
        <div className="info-bar">
          <DifficultyIcon fill="#3C3C3C" size={16} level={recipe.difficulty} />
          { recipe.difficulty === 'easy' ? 
          <h2>Easy</h2> : 
          recipe.difficulty === 'med' ? 
          <h2>Moderate</h2> : 
          <h2>Difficult</h2>
          }
        </div>
      </div>
      <div className="banner" style={bannerImgStyle}>

      </div>

      <div className="top-btn-row">
        <div className={`icon-button`} onClick={toggleBookmarkRecipe}>
          <BookmarkIcon outerFill={"#3C3C3C"} innerFill={recipe.bookmarked ? '#e94c4c8f': '#FFFFFF00'} size="20"/>
        </div>
        <div className="icon-button" onClick={copyLinkText}>
          <ShareIcon fill="#3C3C3C" size="20"/>
        </div>
        <div className="icon-button" style={{padding: '8px'}}>
          <CommentsIcon fill="#3C3C3C" size="22"/>
        </div>
        <div className="icon-button" style={{padding: '6px'}}>
          <SpatulaIcon fill="#3C3C3C" size="26"/>
        </div>
      </div>

      <div className="btm-btn-row">
        <div className="icon-button" onClick={goToIngredients}>
          <ListIcon fill="#3C3C3C" size="20" />
          <h2>Ingredients</h2>
        </div>
        <div className="icon-button" onClick={goToInstructions}>
          <OrderedListIcon fill="#3C3C3C" size="20" />
          <h2>Instructions</h2>
        </div>
      </div>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, userState: state.user, layout: state.layout}})(RecipeDetails);
