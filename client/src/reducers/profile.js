import {
  FOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
  UNFOLLOW_USER,
} from "../constants/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case PROFILE_PAGE_LOADED:
      return {
        ...action.payload[0].profile,
      };
    case PROFILE_PAGE_UNLOADED:
      return {};
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...action.payload.profile,
      };
    default:
      return state;
  }
};
