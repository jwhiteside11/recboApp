import { useAppDispatch } from "./redux/hooks"
import { AppDispatch } from './redux/store'
import { changeRouteStateHistory, changeRouteStateNoHistory } from "./redux/routes/routeSlice"
import {  Ingredient, Instruction, Recipe, RecipeInfoChunk, UserBlip, User, Comment, RecipeDataTypes } from "./types"
import { IngredientMetrics, parseIngredient, templateToString } from "./ingredientParser"

export const RECBO_FRONTEND_URL = "http://localhost:3000"

declare global {
  export interface Crypto {
    randomUUID: () => string;
  }
}

export const userJDWblip: UserBlip = {
  image: '',
  displayName: 'John Whiteside',
  username: 'jwhiteside11'
}

const exampleRecipeInfo: (recipeID: string, position: number, dataType: RecipeDataTypes, data: string) => RecipeInfoChunk = (recipeID, position, dataType, data) => {
  return {
    recipeID,
    position,
    dataType,
    data
  }
}

const exampleIngredientData: [string, RecipeDataTypes][] = [
  ['Fried Chicken', 'title'],
  ['400g chicken breast', 'item'],
  ['15g soy sauce', 'item'],
  ['100g all-purpose flour', 'item'],
  ['100g cornstarch', 'item'],
  ['5g salt', 'item'],
  ['White pepper, to taste', 'item'],
  ['1 liter peanut/vegetable oil', 'item'],
  ['Sauce', 'title'],
  ['75g white sugar', 'item'],
  ['15g soy sauce', 'item'],
  ['10g cornstarch', 'item'],
  ['30g rice vinegar', 'item'],
  ['Fried Rice', 'title'],
]

const parsedIngredients: IngredientMetrics[] = []
exampleIngredientData.forEach(ll => {
    parsedIngredients.push(parseIngredient(ll[0]))
})

console.log("PARSED", parsedIngredients)

const injectedIngredients: string[] = Array(parsedIngredients.length)

parsedIngredients.forEach((ing, i) => {
    injectedIngredients[i] = templateToString(ing.template, {'q': String(ing.quantity), 'u': ing.unit})
})

console.log("INJECTED", injectedIngredients)

parsedIngredients.forEach((ing, i) => {
    injectedIngredients[i] = templateToString(ing.template, {'q': String(ing.quantity * 2), 'u': ing.unit})
})

console.log("INJECTED X2", injectedIngredients)

parsedIngredients.forEach((ing, i) => {
    injectedIngredients[i] = templateToString(ing.template, {'q': String(ing.quantity * 3), 'u': ing.unit})
})

console.log("INJECTED X3", injectedIngredients)

const exampleInstructionData: [string, RecipeDataTypes][] = [
['Preheat the peanut oil for in a heavy, deep pot, appropriate for deep-frying.', 'step'],
['Cut chicken breast into 1” chunks, then add to medium bowl with soy sauce, salt, and white pepper. Let sit for 20 min.', 'step'],
['Stir the flour and cornstarch into the chicken, and then deep fry in batches, being sure not to overcrowd the pot.', 'step'],
['In a medium saucepan over medium heat, combine all sauce ingredients except the cornstarch and 2 Tbsp water. Bring to a simmer.', 'step'],
['Combine corn starch and remaining water, stir until well mixed. Add mixture to saucepan and heat while stirring until thick.', 'step'],
['Turn the fry oil up to medium heat, and wait for the oil to come up to 375ºF. When at temperature, fry the chicken in batches, about 30 seconds each, or until golden brown.', 'step'],
['Drain oil from chicken for 30 seconds, then add the chicken to the pan to combine with the sauce. Stir well until combined.', 'step'],
['Garnish with sesame seeds or chopped chives. Serve over rice immediately.', 'step'],
['Preheat the peanut oil for in a heavy, deep pot, appropriate for deep-frying.', 'step'],
['Cut chicken breast into 1” chunks, then add to medium bowl with soy sauce, salt, and white pepper. Let sit for 20 min.', 'step'],
['Stir the flour and cornstarch into the chicken, and then deep fry in batches, being sure not to overcrowd the pot.', 'step'],
['In a medium saucepan over medium heat, combine all sauce ingredients except the cornstarch and 2 Tbsp water. Bring to a simmer.', 'step'],
['Combine corn starch and remaining water, stir until well mixed. Add mixture to saucepan and heat while stirring until thick.', 'step'],
['Turn the fry oil up to medium heat, and wait for the oil to come up to 375ºF. When at temperature, fry the chicken in batches, about 30 seconds each, or until golden brown.', 'step'],
['Drain oil from chicken for 30 seconds, then add the chicken to the pan to combine with the sauce. Stir well until combined.', 'step'],
['Garnish with sesame seeds or chopped chives. Serve over rice immediately.', 'step'],
]

export const ingredientList: (listData: [string, RecipeDataTypes][], recipeID: string) => Ingredient[] = (listData, recipeID) => {
  const list: Ingredient[] = []
  listData.forEach((data, i) => list.push(exampleRecipeInfo(recipeID, i, data[1], data[0])))
  return list;
}

export const instructionList: (listData: [string, RecipeDataTypes][], recipeID: string) => Instruction[] = (listData, recipeID) => {
  const list: Instruction[] = []
  listData.forEach((data, i) => list.push(exampleRecipeInfo(recipeID, i, data[1], data[0])))
  return list;
}

export const emptyRecipe: () => Recipe = () => {
  return {
    user: {
      image: "",
      username: "",
      displayName: ""
    },
    name: "",
    recipeID: "",
    datePublished: 'Oct 09, 2021',
    timeEstimate: '2hr 40min',
    difficulty: 'med',
    bannerImage: "",
    images: [],
    link: "Hello John!",
    comments: [],
    bookmarked: false,
    cookCount: 101,
    ingredients: [],
    instructions: [],
    }
}

export const emptyRecipeOut = emptyRecipe()

const exampleRecipe: (name:string, i: number) => Recipe = (name, i) => {
  const user: UserBlip = userJDWblip
  const recipeID: string = String(i)
  const images: string[] = []
  const comments: Comment[] = []
  const ingredients: Ingredient[] = ingredientList(exampleIngredientData, recipeID)
  const instructions: Instruction[] = instructionList(exampleInstructionData, recipeID)
  return {
    user,
    name,
    recipeID,
    datePublished: 'Oct 09, 2021',
    timeEstimate: '2hr 40min',
    difficulty: 'med',
    bannerImage: "",
    images,
    link: "Hello John!",
    comments,
    bookmarked: false,
    cookCount: 101,
    ingredients,
    instructions,
    }
}

const recipeNames: string[] = [
  "General Tso's Chicken w/ Vegetable Fried Rice",
  "Apple crumble pie with dutch crisp topping",
  "Tomato Pie with Mozarella and romano cheese",
  "Smoked Halibut with Rice Pilaf and Spring Olives",
  "bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjew",
  "bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpe",
  "Smoked Halibut with Rice bhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjewbhvieanjowinruiavjnoerunwepivoejwcpeiovjwncpeorjevnpewovjew",
  "Example title with example sides and example toppings with example",
  "Short example title",
]

export const recipeList: Recipe[] = [emptyRecipe()];
recipeNames.forEach((rec, i) => recipeList.push(exampleRecipe(recipeNames[i], i)))

export const userJDW: User = {
  email: 'example@gmail.com',
  username: 'jwhiteside11',
  image: '../../assets/graphics/recbo-logo.svg',
  displayName: 'John Whiteside',
  occupation: 'Home cook',
  allergies: [
    {name: 'Peanuts', id: 1},
    {name: 'Legumes', id: 2},
    {name: 'Lobster', id: 3}
  ],
  flavorPreferences: [
    {name: 'Spicy', id: 1},
    {name: 'Sweet', id: 2},
    {name: 'Sichuanese', id: 3},
  ],
  favoriteFoods: [
    {name: 'General Tso’s Chicken'},
    {name: 'Milk Steak'},
    {name: 'Chicken Parmesan'},
    {name: 'Buffalo Wings'},
    {name: 'Roasted Summer Vegetables'},
  ],
  recipes: recipeList,
  privateAccount: false
}

export const mapRouteToTitle = (route: string, username: string = 'Recbo') => {
  console.log("USING MAPPER", route)
  const routeOptions: {[key: string]: string} = {
    '/login': `Login | Recbo`,
    '/sign-up': `Sign Up | Recbo`,
    '/search': `Search | ${username}`, 
    '/explore': `Explore | ${username}`, 
    '/feed': `Feed | ${username}`, 
    '/library': `Library | ${username}`,
    '/settings': `Settings | ${username}`,
  }
  return routeOptions[route] ?? 
  (route.slice(0, 8) === '/profile' ? `${username} | User Profile`: 
  (route.slice(0, 7) === '/recipe' ? `Recipe by ${username}`: 'Recbo - create, share, discover'))
}

export const parseIngredientFromString = (s: string) => {
    // Important info - quantity, unit, nutritional synonym
    // k = len(s)
    // Extract quantity
    
    // Extract unit
    // Extract nutritional synonym
}   