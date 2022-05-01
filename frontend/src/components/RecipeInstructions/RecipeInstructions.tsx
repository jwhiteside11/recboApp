import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './RecipeInstructions.scss';
import { Instruction, Recipe, RecipeInfoChunk, User } from '../../types';
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
import OrderedListIcon from '../svgFCs/OrderedListIcon';
import { LayoutState, setNewScrollTop } from '../../redux/layout/layoutSlice';
import { useAppDispatch } from '../../redux/hooks';
import useSetViewElemHeight from '../../hooks/useSetViewElemHeight';

type RecipeInstructionsProps = {
  routeInfo: RouteState,
  user: User,
  layout: LayoutState
}

const RecipeInstructions = ({routeInfo, user, layout}: RecipeInstructionsProps) => {
  const recipeID = routeInfo.route.slice(8);
  const recipe = user.recipes.find(rec => rec.recipeID === recipeID) ?? user.recipes[0]

  const instructionStep: (data:string, stepNumber: number) => JSX.Element = useCallback((data, stepNumber) => {
    return (
    <div key={`step_${stepNumber}`} className="step">
      <p>Step {stepNumber}:</p>
      <p>{data}</p>
    </div> )
  }, [])

  const instructionElement: (chunk: RecipeInfoChunk) => JSX.Element = useCallback((chunk)  => {
    switch (chunk.dataType) {
    case 'item':
      return (<p key={`listItem_${chunk.data.slice(0, 3)}`} className="listItem">{chunk.data}</p>)
    case 'title':
      return (<p key={`title_${chunk.data.slice(0, 3)}`} className="title">{chunk.data}</p>)
    default: // 'step'
      return (<p key={`note_${chunk.data.slice(0, 3)}`} className="note">{chunk.data}</p>)
    }
  }, [])

  const instructionElems: JSX.Element[] = useMemo(() => {
    const instructions: Instruction[] = recipe.instructions
    const elems: JSX.Element[] = []
    let stepNumber: number = 1

    for (let i = 0; i < instructions.length; i++) {
      const inst: Instruction = instructions[i];
      let elem: JSX.Element;
      if (inst.dataType === 'item') {
        elem = instructionStep(inst.data, stepNumber++)
      } else if (inst.dataType === 'title') {
        elem = instructionElement(inst)
      } else {
        elem = instructionElement(inst)
      }
      elems.push(elem)
    }
    return elems
  }, [recipe.instructions, instructionElement, instructionStep])

  return (
    <div className="RecipeInstructions">
      <div className="recipe-header">
        <div>
          <OrderedListIcon fill="#3C3C3C" size="32" />
          <h1>Instructions</h1>
        </div>
      </div>

      <div className="instruction-body">
        { instructionElems }
      </div>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user, layout: state.layout}})(RecipeInstructions);
