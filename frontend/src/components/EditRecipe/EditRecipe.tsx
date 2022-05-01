import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import './EditRecipe.scss';
import { IconProps, Recipe, RecipeInfoChunk, User } from '../../types';
import { emptyRecipe, emptyRecipeOut, userJDW } from '../../globals';
import EditIcon from '../svgFCs/EditIcon';
import { useAppDispatch } from '../../redux/hooks';
import { changeRouteStateHistory } from '../../redux/routes/routeSlice';
import DetailsIcon from '../svgFCs/DetailsIcon';
import DetailsInspect from '../svgFCs/DetailsInspect';
import ListIcon from '../svgFCs/ListIcon';
import OrderedListIcon from '../svgFCs/OrderedListIcon';
import PlusSignIcon from '../svgFCs/PlusSignIcon';
import PortraitIcon from '../svgFCs/PortraitIcon';
import InputBar from '../InputBar/InputBar';
import InputBox from '../InputBox/InputBox';
import CircleFilled from '../svgFCs/CircleFilled';
import MenuIcon from '../svgFCs/MenuIcon';
import TrashIcon from '../svgFCs/TrashIcon';
import UndoIcon from '../svgFCs/UndoIcon';
import XIcon from '../svgFCs/XIcon';
import CheckIcon from '../svgFCs/CheckIcon';
import useShakeButton from '../../hooks/useShakeButton';
import ShakeButton from '../ShakeButton/ShakeButton';

type EditRecipeProps = {
  recipe?: Recipe
}

const EditRecipe = ({recipe}: EditRecipeProps) => {
  const [nameContent, setNameContent] = useState<string>(recipe?.name ?? "")
  const [ingredientData, setIngredientData] = useState<RecipeInfoChunk[]>([{dataType: "item", data: ""}])
  const [instructionData, setInstructionData] = useState<RecipeInfoChunk[]>([{dataType: "step", data: ""}])
  const [deletingIngredients, setDeletingIngredients] = useState<boolean>(false)
  const [deletingInstructions, setDeletingInstructions] = useState<boolean>(false)
  const [ingredientsShaking, setIngredientsShaking] = useState<boolean>(false)
  const [instructionsShaking, setInstructionsShaking] = useState<boolean>(false)
  const shakeTimers = useRef<NodeJS.Timeout[]>()
  const ingDelBtnKey = useMemo(() => crypto.randomUUID(), [])
  const dispatch = useAppDispatch()

  const headerButton = (icon: JSX.Element, action: () => void) => {
    return (
      <div className={`header-btn`} onClick={() => action()}>
        {icon}
      </div>
    )
  }

  const sectionHeader = (text: string, icon: JSX.Element, buttons: JSX.Element[]) => {
  return (
      <div className="section-header">
        {icon}
        <h2>{text}</h2>
        <div className="header-btn-wrap">
          {buttons}
        </div>
      </div>
    )
  }

  const addInputBtn = (text: string, action: () => void) => {
    return (
      <div className="add-input-btn" onClick={() => action()}>
        <PlusSignIcon fill="#3C3C3C" size="14" />
        <span>{text}</span>
      </div>
    )
  }

  const titledContent = (title: string, content: JSX.Element) => {
    return (
      <div className="titled-content">
        <h3>{title}</h3>
        {content}
      </div>
    )
  }

  const setIngredient = (i: number, data: RecipeInfoChunk) => {
    const ingCopy = [...ingredientData]
    ingCopy[i] = data
    setIngredientData(ingCopy)
  }

  const setInstruction = (i: number, data: RecipeInfoChunk) => {
    const insCopy = [...instructionData]
    insCopy[i] = data
    setInstructionData(insCopy)
  }

  const setIngredientText = (i: number, data: string) => {
    const ingCopy = [...ingredientData]
    ingCopy[i].data = data
    setIngredientData(ingCopy)
  }

  const setInstructionText = (i: number, data: string) => {
    const insCopy = [...instructionData]
    insCopy[i].data = data
    setInstructionData(insCopy)
  }

  useEffect(() => {
    if (recipe === undefined) {
      return
    }
    setIngredientData(recipe.ingredients)
    setInstructionData(recipe.instructions)
  }, [recipe])

  const recipeIngredients = () => {
    return ingredientData.map((ing, i) => {
      return (
        <div key={`ing_${i}`} className={`ingredient-${ing.dataType}`}>
          { ing.dataType === 'item' &&
          <CircleFilled fill="#3C3C3C" size="10"/> }
          <InputBar placeholder={ing.dataType === "item" ? "Ex. 1/4 cup sugar": "Ex. Tempura Batter"} data={ingredientData[i].data} setter={(s) => setIngredientText(i, s)}/>
          { deletingIngredients ? 
          <div className="x-wrap" onClick={() => removeIngredient(i)}><XIcon fill="#3C3C3C" size="18"/></div> :
          <MenuIcon fill="#3C3C3C" size="18"/> }
        </div>
      )
    })
  }

  const recipeInstructions = () => {
    return instructionData.map((ins, i) => {
      return (
        <div key={`ins_${i}`} className={`instruction-${ins.dataType}`}>
          <span>Step {i + 1}.</span>
          { deletingInstructions ? 
          <div className="x-wrap" onClick={() => removeInstruction(i)}><XIcon fill="#3C3C3C" size="18"/></div> :
          <MenuIcon fill="#3C3C3C" size="18"/> }
          <InputBox placeholder="Ex. Whisk the milk and eggs." data={instructionData[i].data} setter={(s) => setInstructionText(i, s)}/>
        </div>
      )
    })
  }

  const addIngredientItem = (data: string) => {
    setIngredientData([...ingredientData, {dataType: "item", data}])
  }

  const addIngredientTitle = (data: string) => {
    setIngredientData([...ingredientData, {dataType: "title", data}])
  }

  const addInstructionStep = (data: string) => {
    setInstructionData([...instructionData, {dataType: "step", data}])
  }

  const removeIngredient = (index: number) => {
    if (ingredientData.length === 1) {
      setDeletingIngredients(false)
    }
    setIngredientData(ingredientData.filter((ing, i) => i !== index))
  }

  const removeInstruction = (index: number) => {
    if (instructionData.length === 1) {
      setDeletingInstructions(false)
    }
    setInstructionData(instructionData.filter((ing, i) => i !== index))
  }

  const shakeButton = useCallback((btnKey) => {
    document.dispatchEvent(new Event("shake_" + btnKey))
  }, [])

  const toggleDeletingIngredients = useCallback((btnKey) => {
    if (ingredientData.length === 0) {
      setDeletingIngredients(false)
      shakeButton(ingDelBtnKey)
      return
    }
    setDeletingIngredients(!deletingIngredients)
  }, [deletingIngredients, ingredientData, ingDelBtnKey, shakeButton])

  const toggleDeletingInstructions = () => {
    if (instructionData.length === 0) {
      setDeletingInstructions(false)
      shakeButton(ingDelBtnKey)
      return
    }
    setDeletingInstructions(!deletingInstructions)
  }
  
  const deletingIngredientsBtnUnwrapped = useMemo(() => {
    return headerButton(deletingIngredients ? <CheckIcon fill="#3c3c3c" size={18}/> : <TrashIcon fill="#3c3c3c" size="18"/>, () => toggleDeletingIngredients(ingDelBtnKey))
  }, [deletingIngredients, ingDelBtnKey, toggleDeletingIngredients])

  return (
    <div className="EditRecipe">
      {sectionHeader("Details", <DetailsInspect fill="#3c3c3c" size="27"/>, [])}
      {titledContent("Name:", <InputBox placeholder="Ex. General Tso's Chicken" data={nameContent} setter={setNameContent} />)}
      {titledContent("Image:", <div className="add-image-btn"><div><PortraitIcon fill="#3C3C3C" size="14"/><span>Upload</span></div></div>)}

      {sectionHeader("Ingredients", <ListIcon fill="#3c3c3c" size="27"/>, [headerButton(<UndoIcon fill="#3c3c3c" size="18"/>, () => alert("UNDO")), <ShakeButton btn={deletingIngredientsBtnUnwrapped} btnKey={ingDelBtnKey} />])}
      <div className="ingr-wrap">
        {recipeIngredients()}
      </div>
      <div className="input-btn-wrap">
        {addInputBtn("Subtitle", () => addIngredientTitle(""))}
        {addInputBtn("Ingredient", () => addIngredientItem(""))}
      </div>

      {sectionHeader("Instructions", <OrderedListIcon fill="#3c3c3c" size="27"/>, [headerButton(<UndoIcon fill="#3c3c3c" size="18"/>, () => alert("UNDO")), headerButton(deletingInstructions ? <CheckIcon fill="#3c3c3c" size={18}/> : <TrashIcon fill="#3c3c3c" size="18"/>, () => toggleDeletingInstructions())])}
      <div className="inst-wrap">
        {recipeInstructions()}
      </div>
      <div className="input-btn-wrap">
        {addInputBtn("Step", () => addInstructionStep(""))}
      </div>
    </div>
  );
}

export default EditRecipe;
