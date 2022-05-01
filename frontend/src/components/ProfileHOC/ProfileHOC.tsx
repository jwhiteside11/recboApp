import React, { useEffect, useState, useMemo, useCallback } from 'react';
import './ProfileHOC.scss';
import { User } from '../../types';
import SettingsIcon from '../svgFCs/SettingsIcon';
import { useAppDispatch } from '../../redux/hooks';
import { changeRouteStateNoHistory, RouteState } from '../../redux/routes/routeSlice';
import SettingsPage from '../SettingsPage/SettingsPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';

type ProfileHOCProps = {
  routeInfo: RouteState,
  user: User
}

const ProfileHOC = ({routeInfo, user}: ProfileHOCProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const subcomponentOptions = useMemo(() => [<ProfilePage />, <SettingsPage />], [])

  // Redux
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log("setting hoc route");
    if (routeInfo.route === '/settings') {
      setActiveIndex(1);
    } else {
      setActiveIndex(0);
    }
  }, [routeInfo])

  const toggleSubcomponentRoute = useCallback(() => {
    console.log("TOGGLIN")
    if (activeIndex === 0) {
      dispatch(changeRouteStateNoHistory("/settings", `Settings | ${user.username}`))
    } else {
      dispatch(changeRouteStateNoHistory(`/profile/${user.username}`, `${user.username} | User Profile`))
    }
  }, [activeIndex, user, dispatch])

  
  return (
    <div className="ProfileHOC">
      <div className="profile-upper">
        <div className="icon-button" onClick={toggleSubcomponentRoute}>
          <SettingsIcon fill="#3C3C3C" size="18" />
        </div>
      </div>

      <div className="body">
        { subcomponentOptions[activeIndex] }
      </div>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, user: state.user.user}})(ProfileHOC);
