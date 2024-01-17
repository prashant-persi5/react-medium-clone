import {
  APP_LOAD,
  ARTICLE_PAGE_UNLOADED,
  ARTICLE_SUBMITTED,
  DELETE_ARTICLE,
  EDITOR_PAGE_UNLOADED,
  HOME_PAGE_UNLOADED,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  LOGOUT,
  PROFILE_FAVORITES_PAGE_UNLOADED,
  PROFILE_PAGE_UNLOADED,
  REDIRECT,
  REGISTER,
  REGISTER_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
  SETTINGS_SAVED,
} from "../constants/actionTypes";

const defaultState = {
  appName: "Medium",
  token: null,
  viewChangeCounter: 0,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: "/", token: null, currentUser: null };
    case ARTICLE_SUBMITTED:
      return {
        ...state,
        redirectTo: action.error
          ? null
          : `/article/${action.payload.data.slug}`,
      };
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : "/",
        currentUser: action.error ? null : action.payload.user,
      };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : "/",
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
      };
    case DELETE_ARTICLE:
      return { ...state, redirectTo: "/" };
    case ARTICLE_PAGE_UNLOADED:
    case EDITOR_PAGE_UNLOADED:
    case HOME_PAGE_UNLOADED:
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
};
