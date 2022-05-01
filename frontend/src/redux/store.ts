import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import routeReducer from '../redux/routes/routeSlice';
import userReducer from '../redux/user/userSlice';
import layoutReducer from '../redux/layout/layoutSlice';
import apiReducer from '../redux/api/apiSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    routes: routeReducer,
    user: userReducer,
    layout: layoutReducer,
    api: apiReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
