export const LANDING_PAGE = 'landing-page'
export const TERMS = 'terms'
export const PRIVACY_POLICY = 'privacy-policy'
export const ADD_BLOG = 'add-blog'
export const CREATORS = 'creators'

export const APP = 'app'
export const APP_HOME = 'home'
export const APP_RECIPE = 'recipe'
export const APP_RECIPES = 'recipes'
export const APP_FAVOURITES = 'favourites'
export const APP_COOK_IT = 'cook-it'
export const APP_ALMOST_AVAILABLE = 'almost-available'
export const APP_MY_KITCHEN = 'my-kitchen'
export const APP_SHOPPING_LIST = 'shopping-list'
export const APP_ACCOUNT = 'account'
export const APP_BLOG = 'blog'
export const APP_HIDDEN_BLOGS = 'hidden-blogs'
export const APP_HIDDEN_RECIPES = 'hidden-recipes'
export const APP_HELP = 'help'

export const AUTH = 'auth'
export const AUTH_LOGIN = 'login'
export const AUTH_REGISTER = 'register'
export const AUTH_REGISTER_SUCCESS = 'register-success'
export const AUTH_REQUEST_PASSWORD_RESET = 'request-password-reset'
export const AUTH_RESET_PASSWORD = 'reset-password'
export const AUTH_CONFIRM_EMAIL = 'confirm-email'

export const NOT_FOUND = 'not-found'

export const APP_ROUTE_NAMES = [
  APP_HOME,
  APP_RECIPE,
  APP_RECIPES,
  APP_FAVOURITES,
  APP_COOK_IT,
  APP_ALMOST_AVAILABLE,
  APP_MY_KITCHEN,
  APP_SHOPPING_LIST,
  APP_ACCOUNT,
  APP_BLOG,
  APP_HIDDEN_BLOGS,
  APP_HIDDEN_RECIPES,
  APP_HELP
]

export const LOGGED_USER_ALLOWED_ROUTE_NAMES = [
  ...APP_ROUTE_NAMES,
  TERMS,
  PRIVACY_POLICY,
  ADD_BLOG,
  CREATORS,
  NOT_FOUND,
  AUTH_RESET_PASSWORD
]
