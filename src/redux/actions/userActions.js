import * as Types from "../types";
import * as firebase from "firebase";
// var firebaseui = require('firebaseui');

const db = firebase.firestore();
const auth = firebase.auth();

export const getUserInfo = (email, password) => {
  return (dispatch) => {
    //   alert("action called")
      console.log("action called");
      return new Promise((resolve) => {
        auth.signInWithEmailAndPassword(email, password).then((cred) => {
            /*localStorage.setItem(
              "uid",
              JSON.stringify(firebase.auth().currentUser.uid)
            );
            localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));*/
            resolve(true);
            dispatch({
                payload : JSON.stringify(firebase.auth().currentUser.uid),
                type : Types.GET_USER_PROFILE_SUCCESS,
            })
          });
      })
    
  };
};



/*export const userLogOut = () => {
  return (dispatch) => {
    dispatch({
      type: Types.USER_LOGOUT,
    });
  };
};

export const clearSearchResults = () => {
  return (dispatch) => {
    dispatch({
      type: Types.SEARCH_USERS_FAILURE,
    });
  };
};*/
