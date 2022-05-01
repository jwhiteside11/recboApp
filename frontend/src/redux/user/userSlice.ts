import { createAsyncThunk, createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { LibraryContent, Recipe, RecipeMetaInfo, TokenInfo, User } from '../../types';
import { mapRouteToTitle, userJDW } from '../../globals';

export interface UserState {
  user: User;
  library: LibraryContent;
  fetchCache: {
    recipeMetaInfo: {size: number, keyVals: {[key: string]: RecipeMetaInfo}},
    fullRecipes: {size: number, keyVals: {[key: string]: RecipeMetaInfo}}
  };
  tokenInfo: TokenInfo;
  loggedIn: boolean;
}

const recLen = userJDW.recipes.length
const metaInfoMap:  {size: number, keyVals: {[key: string]: RecipeMetaInfo}} = {size: userJDW.recipes.length, keyVals: {}}
const creationIDs: string[] = Array(recLen)

userJDW.recipes.forEach((rec, i) => {
  creationIDs[i] = rec.recipeID
  metaInfoMap.keyVals[rec.recipeID] = rec as RecipeMetaInfo
})

const initialState: UserState = {
  user: userJDW,
  fetchCache: {
    recipeMetaInfo: metaInfoMap,
    fullRecipes: {size: 0, keyVals: {}}
  },
  library: {
    recentlyViewed: [],
    bookmarked: [],
    creations: creationIDs,
    drafts: []
  },
  tokenInfo: {
    requestToken: "",
    refreshToken: "",
  },
  loggedIn: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      console.log("setting user");
      state.user = action.payload;
    },
    toggleUserRecipeBookmarked: (state, action: PayloadAction<string>) => {
      const recipeID = action.payload
      const recipe = state.user.recipes.find(rec => rec.recipeID === recipeID) ?? state.user.recipes[0]
      console.log("setting recipe " + action.payload + " to " + !recipe.bookmarked);
      recipe.bookmarked = !recipe.bookmarked
      state.fetchCache.recipeMetaInfo.keyVals[recipeID].bookmarked = recipe.bookmarked
    },
    addToRecentlyViewed: (state, action: PayloadAction<RecipeMetaInfo>) => {
      const limit = 50
      let arr = state.library.recentlyViewed
      const recipe = action.payload
      arr = arr.filter(recID => recID !== recipe.recipeID)
      while (state.library.recentlyViewed.length >= limit) {
        arr.pop()
      }
      arr = [recipe.recipeID, ...arr]
      console.log("recents", arr)
      state.library.recentlyViewed = arr
    },
    addToBookmarked: (state, action: PayloadAction<RecipeMetaInfo>) => {
      const recipe = action.payload
      if (!recipe) return;
      let arr = state.library.bookmarked
      if (arr.find(recID => recID === recipe.recipeID)) return;
      arr = [recipe.recipeID, ...arr]
      state.library.bookmarked = arr
    },
    removeFromBookmarked: (state, action: PayloadAction<RecipeMetaInfo>) => {
      const recipe = action.payload
      if (!recipe) return;
      state.library.bookmarked = state.library.bookmarked.filter(recID => recID !== recipe.recipeID)
    },
    addToCreations: (state, action: PayloadAction<RecipeMetaInfo>) => {
      state.library.creations = [...state.library.creations, action.payload.recipeID]
    },
    addToDrafts: (state, action: PayloadAction<RecipeMetaInfo>) => {
      state.library.drafts = [...state.library.drafts, action.payload.recipeID]
    },
    addAllMetaInfoToFetchCache: (state, action: PayloadAction<RecipeMetaInfo[]>) => {
      const maxLen = 400
      const cache = state.fetchCache.recipeMetaInfo
      const arr = action.payload
      if (arr.length + cache.size > maxLen) {
        const entries = Object.keys(cache.keyVals)
        let i = 0
        while (arr.length + cache.size > maxLen) {
          delete cache.keyVals[entries[i++]]
        }
      }
      arr.forEach(info => cache.keyVals[info.recipeID] =  info)
      state.fetchCache.recipeMetaInfo = cache
    },
    clearMetaInfoCache: (state) => {
      state.fetchCache.recipeMetaInfo = {size: 0, keyVals: {}}
    },
    setTokens: (state, action: PayloadAction<TokenInfo>) => {
      console.log("setting tokens");
      state.tokenInfo = action.payload;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      console.log("setting logged in");
      state.loggedIn = action.payload;
    },
    logInAndSetTokens: (state, action: PayloadAction<TokenInfo>) => {
      console.log("setting logged in and tokens");
      state.loggedIn = true;
      state.tokenInfo = action.payload;
    },
    clearAllUserData: (state) => {
      console.log("clearing user data");
      state.loggedIn = false
      state.fetchCache = initialState.fetchCache
      state.library = initialState.library
      state.user = initialState.user
      state.tokenInfo = initialState.tokenInfo
    }
  },
});

/* Exports */
// Actions
export const { 
  setUser,
  toggleUserRecipeBookmarked,
  addToRecentlyViewed,
  addToBookmarked,
  removeFromBookmarked,
  addToCreations,
  addToDrafts,
  addAllMetaInfoToFetchCache,
  clearMetaInfoCache,
  setTokens,
  setLoggedIn,
  logInAndSetTokens,
  clearAllUserData
 } = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user;

// Reducers
export default userSlice.reducer;
