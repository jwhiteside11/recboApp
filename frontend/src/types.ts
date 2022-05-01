
export type MorphPath = {
  pathA: string,
  pathB: string,
  stroke: string,
  strokeWidth: number,
}

export type User = {
  email: string,
  username: string,
  image: string,
  displayName: string,
  occupation: string,
  allergies: Allergy[],
  flavorPreferences: FlavorPreference[],
  favoriteFoods: FavoriteFood[], 
  recipes: Recipe[],
  privateAccount: boolean,
}

export type RecipeDataTypes = 'item' | 'title' | 'step';

export type RecipeInfoChunk = {
  dataType: RecipeDataTypes,
  data: string
}

export type Ingredient = RecipeInfoChunk
export type Instruction = RecipeInfoChunk

export type FlavorPreference = Setting
export type Allergy = Setting

export type FavoriteFood = {
  name: string,
}

export type Setting = {
  name: string,
  id: number
}

export type Recipe = {
  user: UserBlip,
  name: string,
  recipeID: string,
  datePublished: string,
  timeEstimate: string,
  difficulty: 'easy' | 'med' | 'hard',
  bannerImage: string,
  images: string[],
  link: string,
  bookmarked?: boolean,
  comments: Comment[],
  cookCount: number
  ingredients: Ingredient[],
  instructions: Instruction[]
}

export type RecipeDemo = {
  user: UserBlip,
  name: string,
  recipeID: string,
  bannerImage: string,
  ingredients: Ingredient[],
  instructions: Instruction[]
}

export type RecipeSearchResult = {
  recipeID: string,
  recipeName: string,
  authorUsername: string
}

export type Comment = {
  senderUsername: string,
  text: string,
  images: string[]
}

export type RecipeMetaInfo = {
  user: UserBlip,
  name: string,
  recipeID: string,
  bannerImage: string,
  bookmarked?: boolean,
}

export type IconProps = {
  fill: string,
  size: string
}

export type UserBlip = {
  image: string,
  displayName: string,
  username: string
}

export type LibraryContent = {
  recentlyViewed: string[],
  bookmarked: string[],
  creations: string[],
  drafts: string[]
}

export type TokenInfo = {
  requestToken: string,
  refreshToken: string
}

export type UserNewAccountInfo = {
  emailToken: string,
  username: string,
  password: string
}

export interface SVGAnimationElement extends SVGAnimateElement {
  beginElement(): SVGElement;
}