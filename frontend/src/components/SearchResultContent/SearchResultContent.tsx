import React, { useCallback, useMemo } from 'react';
import './SearchResultContent.scss';
import { RecipeSearchResult } from '../../types';
import { useHistory } from 'react-router-dom';
import { RECBO_FRONTEND_URL } from '../../globals';
import { useAppDispatch } from '../../redux/hooks';
import { changeRouteStateHistory } from '../../redux/routes/routeSlice';

type Views = 'grid' | 'list'

type SearchResultContentProps = {
  searchResults: RecipeSearchResult[],
  view: Views
}


const SearchResultContent = ({searchResults, view}: SearchResultContentProps) => {

  const history = useHistory()
  const dispatch = useAppDispatch()

  const goToRecipe = useCallback((id: string) => {
    dispatch(changeRouteStateHistory(`/recipe/${id}`))
  }, [dispatch])

  const results = useMemo(() => {
    return searchResults.map(res =>
    <div className='result-contain' onClick={() => goToRecipe(res.recipeID)}>
      <div className='img-wrap'></div>
      <h3>{res.recipeName}</h3>
      <p>by {res.authorUsername}</p>
    </div>
    )
  }, [searchResults, goToRecipe])

  return (
    <div className="SearchResultContent">
      { view === 'list' ? 
      results :
      <div></div> }
    </div>
  );
}

export default SearchResultContent;
