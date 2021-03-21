import { combineReducers } from "redux";
import UseReducer from "./UserReducer";
import NotificationsReducer from "./NotificationsReducer";


const appReducer = combineReducers({
  /* your app’s top-level reducers */
  UseReducer,
  NotificationsReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }
  return appReducer(state, action);
};