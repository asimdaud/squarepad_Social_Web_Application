import * as Types from "../types";

const initialState = {
  uidRedux : null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_USER_PROFILE_SUCCESS:
        // alert(action.payload)
        console.log(action.payload);
      return {
        ...state,
        uidRedux: action.payload,
      };
    default:
      return state;
  }
};