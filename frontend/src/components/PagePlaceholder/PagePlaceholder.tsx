import React, { useState, useEffect, useMemo } from 'react';
import './PagePlaceholder.scss';
import SearchIcon from '../svgFCs/SearchIcon';
import SortDropdown from '../SortDropdown/SortDropdown';
import SearchBar from '../SearchBar/SearchBar';
import SliderBar from '../SliderBar/SliderBar';
import DetailsIcon from '../svgFCs/DetailsIcon';
import { IconProps } from '../../types';
import ProfileIcon from '../svgFCs/ProfileIcon';
import SliderWindow from '../SliderWindow/SliderWindow';

type PagePlaceholderProps = {
  icon: JSX.Element,
  text: string
}

const PagePlaceholder = ({icon, text}: PagePlaceholderProps) => {
  return (
    <div className="PagePlaceholder">
      <div>
      { icon }
      <h2>{ text }</h2>
      </div>
    </div>
  );
}

export default PagePlaceholder;
