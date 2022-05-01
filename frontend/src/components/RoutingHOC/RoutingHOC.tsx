import React, { useCallback, useEffect } from "react";
import './RoutingHOC.scss';
import MainLayout from "../../components/MainLayout/MainLayout";
import LandingPage from '../../components/LandingPage/LandingPage';
import { setLoggedIn, UserState } from '../../redux/user/userSlice';
import { changeRouteStateHistory, changeRouteStateNoHistory, getQueryParam, RouteState } from '../../redux/routes/routeSlice';
import { connect } from "react-redux";
import { RootState } from '../../redux/store';
import LoginLayout from "../LoginLayout/LoginLayout";
import useSetRouteInfo from "../../hooks/useSetRouteInfo";
import useSetTitle from "../../hooks/useSetTitle";
import {
  Switch,
  Route,
  useHistory,
  useLocation
} from 'react-router-dom';
import { useAppDispatch } from "../../redux/hooks";
import useMapRouteToTitle from "../../hooks/useMapRouteToTitle";
import { APIState, setInitialCredentialCheck, setInitialCredentialCheckLoading } from "../../redux/api/apiSlice";
import { checkCredentials } from "../../recboAPIClient";

type RoutingHOCProps = {
  routeInfo: RouteState,
  userState: UserState,
  apiState: APIState
}
const RoutingHOC = ({routeInfo, userState, apiState}: RoutingHOCProps) => {
  // Hook that sets document route and title to reflect value state variable
  useSetRouteInfo(userState.user)
  // Set title to reflect redux cache value
  useSetTitle(routeInfo.title)

  const dispatch = useAppDispatch()
  const mapRouteToTitle = useMapRouteToTitle()
  const history = useHistory()

  const doCredentialCheck = useCallback(() => {
    console.log("RUNNING CREDENTIAL CHECK")
    checkCredentials().then(res => {
      if (res.status === 200) {
        dispatch(setLoggedIn(true))
      }
      console.log(res)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      dispatch(setInitialCredentialCheck(true))
    })
  }, [dispatch])

  useEffect(() => {
    const route = routeInfo.route
    if (!apiState.initialCredentialCheck) {
      return
    }

    if (userState.loggedIn) {
      console.log("USER IS LOGGED IN", route)
      return
    }

    const loginRoutes = ['/login', '/sign-up', '/complete-sign-up', '/']
    if (!loginRoutes.includes(route)) {
      // not logged in, redirect to landing page
      console.log("not logged in, redirecting to login page", route)
      history.replace("/")
      return
    }

    if (route === '/complete-sign-up') {
      const token = getQueryParam(routeInfo.queryParams, "token")
      if (!token) {
        // token not provided, redirect to sign-up page
        history.replace("/sign-up")
      }
    }
  }, [routeInfo.route, routeInfo.queryParams, userState.loggedIn, userState.user.username, apiState.initialCredentialCheck, dispatch, mapRouteToTitle, history])

  // do initial credential check
  useEffect(() => {
    if (apiState.initialCredentialCheck) {
      return
    }
    doCredentialCheck()
  }, [apiState.initialCredentialCheck, doCredentialCheck])

  return (
    <div className="RoutingHOC">
      <Switch>
        {
        ['/login', '/sign-up', '/complete-sign-up'].map(path => (  
        <Route key={`route ${path}`} path={path}>
          <LoginLayout />
        </Route>
        ))}
        {
        ['/new-recipe', '/create', '/explore', '/feed', '/library', '/search', '/settings', `/profile/:username`, '/recipe/:id'].map(path => (  
        <Route key={`route ${path}`} path={path}>
          <MainLayout />
        </Route>
        ))}
        <Route path='/'>
          <LandingPage />
        </Route>
      </Switch>
    </div>
  );
}

export default connect((state: RootState) => { return {routeInfo: state.routes, userState: state.user, apiState: state.api}})(RoutingHOC);
