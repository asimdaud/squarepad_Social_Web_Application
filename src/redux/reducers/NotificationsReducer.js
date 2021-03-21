import * as Types from "../types";

const initialState = {
  notificationsArray : [],
  chatCounter:0,
  totalNotifications:0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_NOTIFICATION_SUCCESS:
        // alert(action.payload)
        // console.log(action.payload);
      return {
        ...state,
        notificationsArray: action.payload,
      };
      case Types.GET_CHAT_COUNTER_SUCCESS:
        // alert(action.payload)
        // console.log(action.payload);
      return {
        ...state,
        chatCounter: action.payload,
      };
      case Types.GET_TOTAL_NOTIFICATIONS_SUCCESS:
        // alert(action.payload)
        // console.log(action.payload);
      return {
        ...state,
        totalNotifications: action.payload,
      };


    default:
      return state;
  }
};