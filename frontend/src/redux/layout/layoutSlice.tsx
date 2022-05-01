import { createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { User } from '../../types';
import { userJDW } from '../../globals';

export interface ViewScrollState {
  height: number;
  offset: number;
}

export type RecipeViewOptions = 'details' | 'instructions' | 'ingredients'
export type LoginViewOptions = 'login' | 'sign-up' | 'complete-sign-up'

export interface LayoutState {
  mainLayout: {
    currentScrollTop: number;
    newScrollTop: number;
    recipeHeaderButtonsShown: boolean;
    scrollWindowHeight: number;
  }
  recipePage: {
    view: RecipeViewOptions;
    viewElemHeight: number;
    frontViewHeight: number;
    backViewHeight: number;
    flipDirection: 'R' | 'L';
    flipDegrees: number;
    lastFlipPositive: boolean;
    onFront: boolean;
    detailsView: ViewScrollState;
    instructionsView: ViewScrollState;
    ingredientsView: ViewScrollState;
    offsetDriver: [number, boolean];
    editingRecipe: boolean;
  },
  loginLayout: {
    currentScrollTop: number;
    newScrollTop: number;
    view: LoginViewOptions;
    signUpSuccess: boolean;
  }
  sliderWindow: {
    windowHeight: number;
  }
}

const initialViewScrollState: () => ViewScrollState = () => {
  return {
    offset: 0,
    height: 0
  }
}

const initialState: LayoutState = {
  mainLayout: {
    currentScrollTop: 0,
    newScrollTop: 0,
    recipeHeaderButtonsShown: false,
    scrollWindowHeight: 0,
  },
  recipePage: {
    view: 'details',
    viewElemHeight: 0,
    frontViewHeight: 0,
    backViewHeight: 0,
    flipDirection: 'R',
    flipDegrees: 0,
    lastFlipPositive: true,
    onFront: true,
    detailsView: initialViewScrollState(),
    instructionsView: initialViewScrollState(),
    ingredientsView: initialViewScrollState(),
    offsetDriver: [0, true],
    editingRecipe: false
  },
  loginLayout: {
    currentScrollTop: 0,
    newScrollTop: 0,
    view: 'login',
    signUpSuccess: false
  },
  sliderWindow: {
    windowHeight: 0
  }
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setMainScrollTop: (state, action: PayloadAction<number>) => {
      console.log("setting main scroll top", action.payload);
      state.mainLayout.currentScrollTop = action.payload;
    },
    setNewScrollTop: (state, action: PayloadAction<number>) => {
      console.log("setting new scroll top", action.payload, state.recipePage.viewElemHeight);
      state.mainLayout.newScrollTop = action.payload;
    },
    setScrollWindowHeight: (state, action: PayloadAction<number>) => {
      console.log("setting scroll window height")
      state.mainLayout.scrollWindowHeight = action.payload
    },
    setRecipeHeaderButtonsShown: (state, action:  PayloadAction<boolean>) => {
      console.log("setting header buttons to", action.payload)
      state.mainLayout.recipeHeaderButtonsShown = action.payload;
    },
    setRecipePageOnFront: (state, action:  PayloadAction<boolean>) => {
      console.log("setting header buttons to", action.payload)
      state.recipePage.onFront = action.payload;
    },
    goToRecipeView: (state, action: PayloadAction<'details' | 'instructions' | 'ingredients'>) => {
      // Get nextView from payload
      const nextView = action.payload
      // If current view is same as nextView, return
      if (state.recipePage.view === nextView) {
        console.log("SAME VIEW")
        return;
      }
      // Toggle onFront
      state.recipePage.onFront = !state.recipePage.onFront;
      // Hide/show header buttons
      if (nextView === 'details') {
        state.mainLayout.recipeHeaderButtonsShown = false
      } else {
        state.mainLayout.recipeHeaderButtonsShown = true
      }
      // Cache scroll height
      if (state.recipePage.view === 'details') {
        state.recipePage.detailsView.offset = state.mainLayout.currentScrollTop
      } else if (state.recipePage.view === 'instructions') {
        state.recipePage.instructionsView.offset = state.mainLayout.currentScrollTop
      } else if (state.recipePage.view === 'ingredients') {
        state.recipePage.ingredientsView.offset = state.mainLayout.currentScrollTop
      }
      // Set flip direction if coming from details
      if (state.recipePage.view === 'details') {
        if (nextView === 'ingredients') {
          console.log("setting flip direction R")
          state.recipePage.flipDirection = 'R'
        } else {
          console.log("setting flip direction L")
          state.recipePage.flipDirection = 'L'
        }
      }
      // Set active view to input
      state.recipePage.view = nextView
    },
    setViewElemHeight: (state, action: PayloadAction<number>) => {
      console.log("setting view elem height", action.payload, state.mainLayout.currentScrollTop)
      state.recipePage.viewElemHeight = action.payload
    },
    setDetailsViewHeight: (state, action: PayloadAction<number>) => {
      console.log("setting details view height", action.payload)
      state.recipePage.detailsView.height = action.payload
    },
    setInstructionsViewHeight: (state, action: PayloadAction<number>) => {
      console.log("setting instructions view height", action.payload)
      state.recipePage.instructionsView.height = action.payload
    },
    setIngredientsViewHeight: (state, action: PayloadAction<number>) => {
      console.log("setting ingredients view height", action.payload)
      state.recipePage.ingredientsView.height = action.payload
    },
    setFrontViewHeight: (state, action: PayloadAction<number>) => {
      console.log("setting front view height", action.payload)
      state.recipePage.frontViewHeight = action.payload
    },
    setBackViewHeight: (state, action: PayloadAction<number>) => {
      console.log("setting back view height", action.payload)
      state.recipePage.backViewHeight = action.payload
    },
    setFlipDegrees: (state, action: PayloadAction<number>) => {
      console.log("setting flip degrees", action.payload)
      const maxDeg = 100080
      let newDegrees = state.recipePage.flipDegrees + action.payload
      if (newDegrees <= -maxDeg) {
        newDegrees += maxDeg
      }
      state.recipePage.lastFlipPositive = newDegrees > state.recipePage.flipDegrees
      state.recipePage.flipDegrees = newDegrees
    },
    setSliderWindowHeight: (state, action: PayloadAction<number>) => {
      console.log("setting slider window height", action.payload)
      state.sliderWindow.windowHeight = action.payload
    },
    setViewHeightAndScroll: (state, action: PayloadAction<{height: number, offset: number}>) => {
      console.log("setting view and scrolling", action.payload, state.recipePage.viewElemHeight)
      state.recipePage.viewElemHeight = action.payload.height
      state.mainLayout.newScrollTop = action.payload.offset
    },
    setOffsetDriver: (state, action: PayloadAction<[number, boolean]>) => {
      console.log("setting offset driver", action.payload, state.recipePage.viewElemHeight)
      state.recipePage.offsetDriver = action.payload
    },
    resetRecipePage: (state) => {
      state.recipePage.view = 'details'
      state.recipePage.flipDirection = 'R'
      state.recipePage.onFront = true
      state.recipePage.detailsView = initialViewScrollState()
      state.recipePage.instructionsView = initialViewScrollState()
      state.recipePage.ingredientsView = initialViewScrollState()
      state.recipePage.flipDegrees = 0
    },
    setEditingRecipe: (state, action: PayloadAction<boolean>) => {
      state.recipePage.editingRecipe = action.payload
    },
    goToLoginView: (state, action: PayloadAction<'login' | 'sign-up'>) => {
      state.loginLayout.view = action.payload
    },
    resetLoginLayout: (state) => {
      state.loginLayout.view = 'login'
      state.loginLayout.signUpSuccess = false
    },
    setSignUpSucceeded: (state) => {
      state.loginLayout.signUpSuccess = true
    },
    setLoginCurrentScrollTop: (state, action: PayloadAction<number>) => {
      console.log("scrolling login", action.payload)
      state.loginLayout.currentScrollTop = action.payload
    },
    setLoginNewScrollTop: (state, action: PayloadAction<number>) => {
      state.loginLayout.newScrollTop = action.payload
    }
  },
});

/* Exports */
// Actions
export const { 
  setMainScrollTop,
  setNewScrollTop,
  setScrollWindowHeight,
  setRecipeHeaderButtonsShown,
  setRecipePageOnFront,
  goToRecipeView,
  setViewElemHeight,
  setDetailsViewHeight,
  setInstructionsViewHeight,
  setIngredientsViewHeight,
  setFrontViewHeight,
  setBackViewHeight,
  setFlipDegrees,
  setSliderWindowHeight,
  setOffsetDriver,
  resetRecipePage,
  setEditingRecipe,
  goToLoginView,
  resetLoginLayout,
  setSignUpSucceeded,
  setLoginCurrentScrollTop,
  setLoginNewScrollTop
} = layoutSlice.actions;

export const selectViewElemHeight = (state: RootState) => state.layout.recipePage.viewElemHeight
export const selectView = (state: RootState) => state.layout.recipePage.view


export const setViewHeightAndScroll = (height: number, offset: number, bodyRef: React.MutableRefObject<HTMLDivElement | null>): AppThunk => (dispatch, getState) => {
  dispatch(setViewElemHeight(height))
  if (bodyRef?.current) {
    console.log("scrolling from store", offset, height)
    bodyRef.current.scroll({top: offset})
  }
}

export const goToRecipeViewAsync = (view: 'details' | 'instructions' | 'ingredients', flipDeg: number): AppThunk => (dispatch, getState) => {
  dispatch(goToRecipeView(view))
  dispatch(setFlipDegrees(flipDeg))
}

// Reducers
export default layoutSlice.reducer;
