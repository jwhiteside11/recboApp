import { createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { User } from '../../types';
import { mapRouteToTitle, userJDW } from '../../globals';
import SettingsPage from '../../components/SettingsPage/SettingsPage';
import SearchPage from '../../components/SearchPage/SearchPage';
import { resetRecipePage } from '../layout/layoutSlice';

const user: User = userJDW;

export interface RouteState {
  route: string;
  title: string;
  queryParams: string[][];
}

const initialState: RouteState = {
  route: '/',
  title: 'Recbo - A better way to recipe',
  queryParams: []
};

export const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoute: (state, action: PayloadAction<string>) => {
      console.log("setting route");
      state.route = action.payload;
    },
    setRouteAndTitle: (state, action: PayloadAction<[string, string]>) => {
      console.log("setting route and title", action.payload[0], action.payload[1]);
      state.route = action.payload[0];
      state.title = action.payload[1];
    },
    setQueryParams: (state, action: PayloadAction<string[][]>) => {
      console.log("setting query params", action.payload);
      state.queryParams = action.payload
    }
  },
});

export const { setRoute, setRouteAndTitle, setQueryParams } = routeSlice.actions;

const changeRouteCacheState =  (route: string, title: string): AppThunk => (dispatch, getState) => {
  // Set route and title in cache
  dispatch(setRouteAndTitle([route, title]))
}

const changeRouteWindowState = (route: string, title: string, withHistory: boolean): AppThunk => (dispatch, getState) => {
  // Current URL: http://localhost:3306
  const nextState = {};
  const nextTitle = title;
  const nextURL = 'http://localhost:3000' + route;
  // Replace window state
  withHistory ?
  window.history.pushState(nextState, nextTitle, nextURL) :
  window.history.replaceState(nextState, nextTitle, nextURL)
}

export const changeRouteStateHistory = (route: string, username?: string): AppThunk => (dispatch, getState) => {
  const title = username ? mapRouteToTitle(route, username): mapRouteToTitle(route)
  // Push new state to browser window
  dispatch(changeRouteWindowState(route, title, true))
  // Set cache state (route, title for layout effects)
  dispatch(changeRouteCacheState(route, title))
}

export const changeRouteStateNoHistory = (route: string, username?: string): AppThunk => (dispatch, getState) => {
  const title = username ? mapRouteToTitle(route, username): mapRouteToTitle(route)
  // Replace state in browser window
  dispatch(changeRouteWindowState(route, title, false))
  // Set cache state (route, title for layout effects)
  dispatch(changeRouteCacheState(route, title))
}

export const getQueryParam: (queryParams: string[][], key: string) => string | undefined = (queryParams, key) => {
  const res = queryParams.find(q => q[0] === key)
  if (!res) {
    return res
  }
  return res[1]
}

export default routeSlice.reducer;
