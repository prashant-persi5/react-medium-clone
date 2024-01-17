import {
  ASYNC_START,
  SETTINGS_PAGE_UNLOADED,
  SETTINGS_SAVED,
} from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case SETTINGS_SAVED:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.message : null,
      };
    case SETTINGS_PAGE_UNLOADED:
      return {};
    case ASYNC_START:
      return {
        ...state,
        inProgress: true,
      };
    default:
      return state;
  }
};
