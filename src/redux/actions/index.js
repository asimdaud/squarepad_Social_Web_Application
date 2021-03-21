import * as UserActions from "./userActions";
import * as NotificationsActions from "./notificationsActions";

export const ActionsCreator = Object.assign(
  {},
  UserActions,
  NotificationsActions
);