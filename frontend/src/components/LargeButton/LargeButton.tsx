import './LargeButton.scss';
import { connect } from 'react-redux';
import { LayoutState } from '../../redux/layout/layoutSlice';
import { RouteState } from '../../redux/routes/routeSlice';
import { RootState } from '../../redux/store';
import { User } from '../../types';
import { useState } from 'react';

type LoginLayoutProps = {
  routeInfo: RouteState,
  user: User,
  layout: LayoutState,
  text: string,
  onClick: () => void,
  loading: boolean
}

const LoginLayout = ({routeInfo, user, layout, text, onClick, loading}: LoginLayoutProps) => {

  const clickAction = () => {
    onClick()
  }

  return (
    <div className="LargeButton" onClick={clickAction}>
      <div className={`loading-wrap ${loading ? "loading": ""}`}>
        <div className="overlay-bar"></div>
        <div className="btn-wrap">
          <button className="lrg-btn">{text}</button>
        </div>
      </div>
    </div>
  )
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user, layout: state.layout}})(LoginLayout);
