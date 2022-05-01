import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import './RecipeIngredients.scss';
import { Recipe, RecipeInfoChunk, User } from '../../types';
import BookmarkIcon from '../svgFCs/BookmarkIcon';
import ShareIcon from '../svgFCs/ShareIcon';
import CommentsIcon from '../svgFCs/CommentsIcon';
import SpatulaIcon from '../svgFCs/SpatulaIcon';
import ProfileIcon from '../svgFCs/ProfileIcon';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { RouteState } from '../../redux/routes/routeSlice';
import ListIcon from '../svgFCs/ListIcon';
import SortIcon from '../svgFCs/SortIcon';
import HourglassIcon from '../svgFCs/HourglassIcon';
import CalendarIcon from '../svgFCs/CalendarIcon';
import DifficultyIcon from '../svgFCs/DifficultyIcon';
import { LayoutState, setViewElemHeight } from '../../redux/layout/layoutSlice';
import { useAppDispatch } from '../../redux/hooks';
import useSetViewElemHeight from '../../hooks/useSetViewElemHeight';
import ListBubblePoint from '../svgFCs/ListBubblePoint';

type RecipeIngredientsProps = {
  routeInfo: RouteState,
  user: User,
  layout: LayoutState
}

const RecipeIngredients = ({routeInfo, user, layout}: RecipeIngredientsProps) => {
  const dispatch = useAppDispatch()

  const recipeID = routeInfo.route.slice(8);
  const recipe = user.recipes.find(rec => rec.recipeID === recipeID) ?? user.recipes[0]

  const ingredientElement: (chunk: RecipeInfoChunk) => JSX.Element = useCallback((chunk)  => {
    switch (chunk.dataType) {
    case 'item':
      return (
      <div key={`listItem_${chunk.data.slice(0, 3)}`} className="listItem">
        <ListBubblePoint fill="black" size="9" />
        <p>{chunk.data}</p>
      </div> )
    case 'title':
      return (
      <p key={`title_${chunk.data.slice(0, 3)}`} className="title">{chunk.data}</p> )
    default: // 'step'
      return (
      <p key={`step_${chunk.data.slice(0, 3)}`} className="note">{chunk.data}</p> )
    }
  }, [])

  const ingredientElems: JSX.Element[] = useMemo(() => {
    const elems: JSX.Element[] = []
    recipe.ingredients.forEach((ing, i) => elems.push(ingredientElement(ing)));
    return elems
  }, [recipe.ingredients, ingredientElement])
  
  return (
    <div className="RecipeIngredients">
      <div className="recipe-header">
        <div>
          <ListIcon fill="#3C3C3C" size="32" />
          <h1>Ingredients</h1>
        </div>
      </div>

      <div className="ingredient-body">
        { ingredientElems }
      </div>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user, layout: state.layout}})(RecipeIngredients);
