import React, { useEffect, useState, useMemo } from 'react';
import './RecipeBar.scss';
import { IconProps, Recipe, User } from '../../types';
import { userJDW } from '../../globals';
import EditIcon from '../svgFCs/EditIcon';
import { useAppDispatch } from '../../redux/hooks';
import { changeRouteStateHistory } from '../../redux/routes/routeSlice';

type RecipeBarProps = {
  recipe: Recipe
}

const RecipeBar = ({recipe}: RecipeBarProps) => {
  const dispatch = useAppDispatch()

  return (
    <div className="RecipeBar" onClick={() => dispatch(changeRouteStateHistory(`/recipe/${recipe.recipeID}`, recipe.name + ' | Recbo'))}>
      <div className="bar-img">

      </div>

      <h3>{recipe.name}</h3>

      <div className="icon-button">
        <EditIcon fill="#3C3C3C" size="14" />
      </div>
    </div>
  );
}

export default RecipeBar;
