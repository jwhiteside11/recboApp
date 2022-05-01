import React, { useState, useEffect, useMemo, useRef } from 'react';
import './SearchPage.scss';
import SearchIcon from '../svgFCs/SearchIcon';
import SortDropdown from '../SortDropdown/SortDropdown';
import SearchBar from '../SearchBar/SearchBar';
import SliderBar from '../SliderBar/SliderBar';
import DetailsIcon from '../svgFCs/DetailsIcon';
import { IconProps, RecipeSearchResult } from '../../types';
import ProfileIcon from '../svgFCs/ProfileIcon';
import SliderWindow from '../SliderWindow/SliderWindow';
import PagePlaceholder from '../PagePlaceholder/PagePlaceholder';
import { searchForRecipes } from '../../recboAPIClient';
import SearchResultContent from '../SearchResultContent/SearchResultContent';

const SEARCH_DELAY_MS = 300

const SearchPage = () => {
  const [searchContent, setSearchContent] = useState<string>('');
  const searchTimer = useRef<NodeJS.Timeout>()
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<RecipeSearchResult[]>([]);

  const icons: (({ fill, size }: IconProps) => JSX.Element)[] = useMemo(() => [DetailsIcon, ProfileIcon], [])
  const dropdownOpts: string[] = useMemo(() => ['Relevance', 'Newest First', 'Oldest First', 'Cook Count'], [])

  useEffect(() => {
    // when search content changes, clear previous timeout, setTimeout for search request
    if (searchTimer.current) {
      clearTimeout(searchTimer.current)
    }
    if (!searchContent) {
      return
    }
    const timer = setTimeout(() => {
      searchForRecipes(searchContent).then(res => {
        console.log(res)
        const resArr = res.data.results
        if (!resArr) {
          return
        }
        setSearchResults(resArr as RecipeSearchResult[])
      }).catch(err => {
        console.log(err)
      })
    }, SEARCH_DELAY_MS);

    searchTimer.current = timer

    return () => clearTimeout(timer);
  }, [searchContent]);

  const placeholders = useMemo(() => [
    <PagePlaceholder icon={<SearchIcon size="96" fill="#BEBEBE"/>} text="Search for recipes by name" />,
    <PagePlaceholder icon={<SearchIcon size="96" fill="#BEBEBE"/>} text="Search for users by username or display name" />
  ], [])

  const results = useMemo(() => [
    <SearchResultContent searchResults={searchResults} view="list"/>,
    <SearchResultContent searchResults={searchResults} view="list"/>
  ], [searchResults])

  return (
    <div className="SearchPage">
      <div className="search-body">
        <div className="search-input">
          <SearchBar content={searchContent} setter={setSearchContent} />
        </div>

        <div className="search-control">
          <SortDropdown options={dropdownOpts} />
          <SliderBar icons={icons} slideIdx={slideIdx} setSlideIdx={setSlideIdx} />
        </div>

        <SliderWindow slideIdx={slideIdx} setSlideIdx={setSlideIdx} > 
          { searchContent === "" ? 
          placeholders :
          results
          }
        </SliderWindow>
      </div>
    </div>
  );
}

export default SearchPage;
