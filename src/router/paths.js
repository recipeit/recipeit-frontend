export const LANDING_PAGE = '/'
export const TERMS = '/regulamin'
export const PRIVACY_POLICY = '/polityka-prywatnosci'
export const ADD_BLOG = '/dodaj-blog'
export const CREATORS = '/tworcy'

export const APP = '/apka'
export const APP_HOME = '/start'
export const APP_RECIPE = '/przepis/:recipeId'
export const APP_RECIPE_WITHOUT_PARAM = '/przepis/'
export const APP_RECIPES = '/przepisy'
export const APP_FAVOURITES = '/ulubione'
export const APP_COOK_IT = '/ugotuj-to'
export const APP_ALMOST_AVAILABLE = '/dokup-i-ugotuj'
export const APP_MY_KITCHEN = '/kuchnia'
export const APP_SHOPPING_LIST = '/zakupy'
export const APP_ACCOUNT = '/konto'
export const APP_BLOG = '/blog/:blogId'
export const APP_BLOG_WITHOUT_PARAM = '/blog/'
export const APP_HIDDEN_BLOGS = '/ukryte-blogi'
export const APP_HIDDEN_RECIPES = '/ukryte-przepisy'
export const APP_HELP = '/pomoc'

export const AUTH = '/autoryzacja'
export const AUTH_LOGIN = '/logowanie'
export const AUTH_REGISTER = '/rejestracja'
export const AUTH_REGISTER_SUCCESS = '/udana-rejestracja'
export const AUTH_REQUEST_PASSWORD_RESET = '/zapomnialem-hasla'
export const AUTH_RESET_PASSWORD = '/resetowanie-hasla'
export const AUTH_CONFIRM_EMAIL = '/potwierdzenie-email'

export const NOT_FOUND = '/:pathMatch(.*)*'

export const APP_PATHS = [
  APP_HOME,
  // APP_RECIPE,
  APP_RECIPE_WITHOUT_PARAM,
  APP_RECIPES,
  APP_FAVOURITES,
  APP_COOK_IT,
  APP_ALMOST_AVAILABLE,
  APP_MY_KITCHEN,
  APP_SHOPPING_LIST,
  APP_ACCOUNT,
  // APP_BLOG,
  APP_BLOG_WITHOUT_PARAM,
  APP_HIDDEN_BLOGS,
  APP_HIDDEN_RECIPES,
  APP_HELP
]
