import React, { useState, useRef, useMemo } from 'react';
import EditIcon from '../svgFCs/EditIcon';
import DetailsIcon from '../svgFCs/DetailsIcon';
import ShareIcon from '../svgFCs/ShareIcon';
import './RecipeCard.scss';
import BookmarkIcon from '../svgFCs/BookmarkIcon';
import { Recipe, RecipeMetaInfo } from '../../types';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { useAppDispatch } from '../../redux/hooks';
import { changeRouteStateHistory } from '../../redux/routes/routeSlice';
import { addToBookmarked, addToRecentlyViewed, removeFromBookmarked, toggleUserRecipeBookmarked } from '../../redux/user/userSlice';

type RecipeCardProps = {
  recipe: RecipeMetaInfo,
  size?: string
}

const RecipeCard = ({recipe, size="sm"}: RecipeCardProps) => {
  const noBanner: boolean = useMemo(() => recipe.bannerImage === '', [recipe.bannerImage])
  const [flipped, setFlipped] = useState<boolean>(noBanner)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useAppDispatch()

  const copyLinkText = () => {
    navigator.clipboard.writeText(`${process.env.DEV_URL}/${recipe.recipeID}`);
  }

  const handleFlipClick = () => {
    console.log("running handle flip")
    if (noBanner) return;
    setFlipped(!flipped)
  }

  const toggleBookmarkRecipe = () => {
    if (recipe.bookmarked) {
      dispatch(removeFromBookmarked(recipe))
    } else {
      dispatch(addToBookmarked(recipe))
    }
    dispatch(toggleUserRecipeBookmarked(recipe.recipeID))
  }

  const viewRecipeDetails = () => {
    dispatch(changeRouteStateHistory(`/recipe/${recipe.recipeID}`, recipe.name + ' | Recbo'))
  }

  useOnClickOutside(cardRef, () => handleFlipClick, flipped && !noBanner)

  return (
    <div className={`RecipeCard ${size}`} onClick={handleFlipClick} ref={cardRef}>
      <div className={`flipper ${flipped ? "flipped": ""}`}>
        <div className="front">

        </div>
        <div className="back">
        <h3>{recipe.name}</h3>
        <hr/>
        <div className="icon-button-contain">
          <div className={`icon-button`} onClick={toggleBookmarkRecipe}>
            <BookmarkIcon outerFill={"#3C3C3C"} innerFill={recipe.bookmarked ? '#e94c4c8f': '#FFFFFF00'} size={size === 'sm' ? '12': '14'}/>
          </div>
          <div className="icon-button" onClick={copyLinkText}>
            <ShareIcon fill="#3C3C3C" size={size === 'sm' ? '12': '14'}/>
          </div>
          <div className="icon-button" onClick={viewRecipeDetails}>
            <DetailsIcon fill="#3C3C3C" size={size === 'sm' ? '12': '14'}/>
          </div>
        </div>
        </div>
      </div>
      
    </div>
  );
}

export default RecipeCard;
