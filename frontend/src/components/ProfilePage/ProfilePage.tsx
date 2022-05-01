import React, { useEffect, useState, useMemo } from 'react';
import './ProfilePage.scss';
import { IconProps, User } from '../../types';
import { userJDW } from '../../globals';
import SearchBar from '../SearchBar/SearchBar';
import RecipeCard from '../RecipeCard/RecipeCard';
import SortDropdown from '../SortDropdown/SortDropdown';
import SliderBar from '../SliderBar/SliderBar';
import DetailsIcon from '../svgFCs/DetailsIcon';
import ProfileIcon from '../svgFCs/ProfileIcon';
import SliderWindow from '../SliderWindow/SliderWindow';
import GridIcon from '../svgFCs/GridIcon';
import MenuIcon from '../svgFCs/MenuIcon';
import ListIcon from '../svgFCs/ListIcon';
import RecipeBar from '../RecipeBar/RecipeBar';
import SettingsIcon from '../svgFCs/SettingsIcon';
import { useHistory } from 'react-router';
import { useAppDispatch } from '../../redux/hooks';
import SettingsPage from '../SettingsPage/SettingsPage';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { LayoutState, setNewScrollTop } from '../../redux/layout/layoutSlice';

type ProfilePageProps = {
  layout: LayoutState,
  user: User,
}

const ProfilePage = ({layout, user}: ProfilePageProps) => {
  const [currentView, setCurrentView] = useState<string>('grid')
  const [searchContent, setSearchContent] = useState<string>('')
  const [gridElems, setGridElems] = useState<JSX.Element[]>([])
  const [listElems, setListElems] = useState<JSX.Element[]>([])
  const [flavorElems, setFlavorElems] = useState<JSX.Element[]>([])
  // SlideBar props
  const [slideIdx, setSlideIdx] = useState<number>(0);
  const history = useHistory()

  // Redux
  const dispatch = useAppDispatch()

  // On mount, get user recipes
  useEffect(() => {
    const elemsFlavor: JSX.Element[] = []
    const elemsGrid: JSX.Element[] = []
    const elemsList: JSX.Element[] = []

    user.flavorPreferences.forEach(flavor => {
      elemsFlavor.push(<div key={flavor.id}>{flavor.name}</div>)
    })

    user.recipes.forEach(recipe => {
      elemsGrid.push(<RecipeCard recipe={recipe} size="med" key={recipe.name + 'grid'}/>)
      elemsList.push(<RecipeBar recipe={recipe} key={recipe.name + 'list'}/>)
    })
    
    setGridElems(elemsGrid)
    setListElems(elemsList)
    setFlavorElems(elemsFlavor)
  }, [user])

  // Reflect changes to slide index in view
  useEffect(() => {
    const viewOptions = ['grid', 'list']

    setCurrentView(viewOptions[slideIdx] ?? 'other')
    console.log("PROFILE VIEW CHANGE")
  }, [slideIdx])
  
  useEffect(() => {
    // Set scroll height of main layout to reflect size of slider window + everything else in 
    console.log("SLIDER WINDOW HEIGHT ChANGE DETECTED FROM MAIN")
  }, [layout.sliderWindow.windowHeight, dispatch])

  return (
    <div className="ProfilePage">
      <div className="profile-upper">
        <div className="image-contain">
          <img />
        </div>
        <h2>{user.displayName}</h2>
        <h3>{user.occupation}</h3>
      </div>

      <div className="profile-flavor">
        <h3>Flavor Preferences:</h3>
        <div className="bubble-contain">
          { flavorElems }
        </div>
      </div>

      <div className="control-outer">
        <div className="search-input">
          <SearchBar content={searchContent} setter={setSearchContent} />
        </div>
        <div className="profile-control">
          <SortDropdown options={useMemo(() => ['Date: Newest', 'Cook Count', 'Relevance', 'Date: Oldest'], [])} />
          <SliderBar icons={useMemo(() => [GridIcon, ListIcon], [])} slideIdx={slideIdx} setSlideIdx={setSlideIdx} />
        </div>
      </div>

      <SliderWindow slideIdx={slideIdx} setSlideIdx={setSlideIdx}>
        { useMemo(() => [
          <div>
            <div className="grid-view">
              {gridElems}
            </div>
          </div>,
          <div>
            <div className="list-view">
              {listElems}
            </div>
          </div>
          ], [gridElems, listElems])
        }
      </SliderWindow>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user, layout: state.layout}})(ProfilePage);
