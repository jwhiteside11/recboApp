import axios, { AxiosResponse } from "axios"
import { RecipeDemo, TokenInfo, UserNewAccountInfo } from "./types"

const RECBO_BACKEND_URL = "https://localhost:8443"
const RECBO_API_URL = RECBO_BACKEND_URL + "/api"
const RECBO_AUTH_URL = RECBO_BACKEND_URL + "/auth"

const recboGET = (serviceURL: string, path: string, body: any, params: any, withCredentials: boolean) => {
  return axios({
    method: "get",
    url: serviceURL + path,
    data: body,
    params,
    withCredentials: true
  })
}

const recboPOST = (serviceURL: string, path: string, body: any, params: any, withCredentials: boolean) => {
  return axios({
    method: "post",
    url: serviceURL + path,
    data: body,
    params,
    withCredentials: true
  })
}

const recboPATCH = (serviceURL: string, path: string, body: any, params: any, withCredentials: boolean) => {
  return axios({
    method: "patch",
    url: serviceURL + path,
    data: body,
    params,
    withCredentials: true
  })
}

const recboAPIGET = (path: string, body: any, params: any, withCredentials: boolean) => {
  return recboGET(RECBO_API_URL, path, body, params, withCredentials)
}

const recboAPIPOST = (path: string, body: any, params: any, withCredentials: boolean) => {
  return recboPOST(RECBO_API_URL, path, body, params, withCredentials)
}

const recboAPIPATCH = (path: string, body: any, params: any, withCredentials: boolean) => {
  return recboPATCH(RECBO_API_URL, path, body, params, withCredentials)
}

const recboAuthGET = (path: string, body: any, params: any, withCredentials: boolean) => {
  return recboGET(RECBO_AUTH_URL, path, body, params, withCredentials)
}

const recboAuthPOST = (path: string, body: any, params: any, withCredentials: boolean) => {
  return recboPOST(RECBO_AUTH_URL, path, body, params, withCredentials)
}

const recboAuthPATCH = (path: string, body: any, params: any, withCredentials: boolean) => {
  return recboPATCH(RECBO_AUTH_URL, path, body, params, withCredentials)
}

const recipeToBackendType = (recipe: RecipeDemo) => {
  return {
    "recipeID": recipe.recipeID,
    "metadata": {
      "recipeName": recipe.name,
      "authorUsername": recipe.user.username,
      "bannerImageID": recipe.bannerImage
      },
    "instructions": recipe.instructions,
    "ingredients": recipe.ingredients
  }
}

// Auth
export const sendLoginData: (username: string, password: string) => Promise<AxiosResponse> = (username, password) => {
  console.log("sending login data")
  // attempt login by username
  return recboAuthPOST("/login", {username, password}, null, true)

}

export const sendSignUpData: (emailToken: string, username: string, password: string) => Promise<AxiosResponse> = (emailToken, username, password) => {
  return recboAuthPOST("/sign-up", {"token": emailToken, username, password}, {}, false)
}

export const sendVerificationEmail: (email: string) => Promise<AxiosResponse> = (email) => {
  return recboAuthPOST("/request-validation", {email}, {}, false)
}

export const checkCredentials: () => Promise<AxiosResponse> = () => {
  return recboAPIGET("/auth/check-credentials", {}, {}, true)
}

// Search
export const searchForRecipes: (search: string) => Promise<AxiosResponse> = (search) => {
  return recboAPIPOST("/search", {"for": "recipesByName", search}, {}, true)
}

// Recipe
export const getUserAuthoredRecipeMetadata: (username: string) => Promise<AxiosResponse> = (username) => {
  return recboAPIGET("/recipe/meta", {}, {"authorUsername": username}, true)
}

export const getRecipeMetadataByID: (recipeIDs: string[]) => Promise<AxiosResponse> = (recipeIDs) => {
  return recboAPIGET("/recipe/meta", {}, {recipeIDs}, true)
}

export const getRecipe: (recipeID: string) => Promise<AxiosResponse> = (recipeID) => {
  return recboAPIGET("/recipe", {}, {recipeID}, true)
}

export const addRecipe: (recipe: RecipeDemo) => Promise<AxiosResponse> = (recipe) => {
  return recboAPIPOST("/recipe", recipeToBackendType(recipe), {}, true)
}

export const updateRecipe: (recipe: RecipeDemo) => Promise<AxiosResponse> = (recipe) => {
  return recboAPIPATCH("/recipe", recipeToBackendType(recipe), {}, true)
}

// Form validation

const isEmailAddress: (email: string) => boolean = (email) => {
  const matchRes = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  return matchRes !== null
}

const usernameIsInvalid: (username: string) => string = (username) => {
  if (username.length < 4 || username.length > 30) {
    return "Be between 4 and 30 characters in length."
  }
  if (!username.match(/^[a-zA-Z0-9]+$/)) {
    return "Only contain alphanumeric characters."
  }
  return ""
}

const passwordIsInvalid: (password: string) => string = (password) => {
  if (password.length < 8 || password.length > 20) {
    return "Be between 8 and 20 characters in length."
  }
  if (!password.match(/^.*[0-9].*$/)) {
    return "Contain at least one number."
  }
  if (!password.match(/^.*[a-z].*$/)) {
    return "Contain at least one lowercase letter."
  }
  if (!password.match(/^.*[A-Z].*$/)) {
    return "Contain at least one uppercase letter."
  }
  if (!password.match(/^.*[!@#$%^&*].*$/)) {
    return "Contain at least one special character (* ! @ & $ etc.)."
  }
  return ""
}

export const loginInfoInvalid: (username: string, password: string) => string = (username, password) => {
  // validate username
  const validateUsername = usernameIsInvalid(username)
  if (validateUsername) {
    return validateUsername
  }
  const validatePassword = passwordIsInvalid(password)
  // validate password
  if (validatePassword) {
    return validatePassword
  }

  return ""
}

export const emailInfoInvalid: (email: string) => string = (email) => {
  if (email.length < 6 || !isEmailAddress(email)) {
    return "Must be valid email address"
  }
  return ""
}

export const signUpInfoInvalid: (username: string, password: string, confirmPassword: string) => string = (username, password, confirmPassword) => {
  // validate username
  const validateUsername = usernameIsInvalid(username)
  if (validateUsername) {
    return validateUsername
  }
  const validatePassword = passwordIsInvalid(password)
  // validate password
  if (validatePassword) {
    return validatePassword
  }
  // validate confirmPassword
  if (password !== confirmPassword) {
    return "Password fields do not match"
  }

  return ""
}

export const recipeInfoValid: (recipe: RecipeDemo) => boolean = (recipe) => {
  return true
}