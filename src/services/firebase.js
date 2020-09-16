import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// var firebaseui = require('firebaseui');

var firebaseConfig = {
    apiKey: "AIzaSyBGLaPXq7JjITJZG-osUkeSK1pnp3fXG-c",
    authDomain: "square-pad-3a630.firebaseapp.com",
    databaseURL: "https://square-pad-3a630.firebaseio.com",
    projectId: "square-pad-3a630",
    storageBucket: "square-pad-3a630.appspot.com",
    messagingSenderId: "498031225132",
    appId: "1:498031225132:web:04f8dc7c835bec96dd2489",
    measurementId: "G-PLVY9WE9JQ"
  };
  // Initialize Firebase 
  firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const auth = firebase.auth();

// const ui = new firebaseui.auth.AuthUI(firebase.auth());


export { firebase, firestore, auth};
