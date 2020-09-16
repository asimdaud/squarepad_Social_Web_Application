// import { firebase } from "./firebase";
import * as firebase from "firebase";
// var firebaseui = require('firebaseui');

const db = firebase.firestore();
const auth = firebase.auth();

export const CreateUser = (username, name, email, password, bio) => {
   auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    db.collection("users")
      .doc(cred.user.uid)
      .set({
        username: username,
        name: name,
        email: email,
        password: password,
        bio: bio,
        publicProfile: true,
        emailAlert: true,
        // profilePic: profilePic,
      });
    localStorage.setItem(
      "uid",
      JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
    // alert(localStorage.getItem("uid"));
    console.log(cred);
  })
  .catch((err) => {
    // alert(err);
    console.log(err);
  });

  // }
  // else{
  //   // catch((err) => {
  //     alert("Error!");

  //   // })
  // }
};





export const SigninUser = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password).then((cred) => {
    localStorage.setItem(
      "uid",
      JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
    // alert(localStorage.getItem('uid'));
    // console.log(cred);
  });
};

// export const CreateUserGIF = (name, email, photoUrl) => {
//   return auth.createUserWithEmailAndPassword(email,photoUrl).then((cred) => {
//     db.collection("users").doc(cred.user.uid).set({
//       name: name,
//       email: email,
//       photoUrl:photoUrl,
//       publicProfile: true,
//       emailAlert:true,
//     });
//     localStorage.setItem(
//       "uid",
//       JSON.stringify(firebase.auth().currentUser.uid)
//     );
//     localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
//     alert(localStorage.getItem("uid"));
//     console.log(cred);
//   });
// };

export const logOutUser = () => {
  auth.signOut().then(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("uid");
    localStorage.removeItem("Fuid");
    localStorage.removeItem("lat");
    localStorage.removeItem("lon");
    localStorage.removeItem("place");
    localStorage.removeItem("placeId");
    localStorage.removeItem("authUser");
    localStorage.removeItem("groupId");
    localStorage.removeItem("firebaseui::rememberedAccounts");

    // localStorage.clear();

    console.log("Signed Out");
  });
};
export const isUserSignedIn = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // alert(localStorage.getItem('uid'));
      // JSON.parse(localStorage.getItem('authUser'));
      console.log("User is logged in!");
    } else {
      console.log("User is not logged in!");
    }
  });
};

export const userToken = () => {
  firebase.auth.onAuthStateChanged((authUser) => {
    authUser
      ? localStorage.setItem("authUser", JSON.stringify(authUser))
      : localStorage.removeItem("authUser");
  });
};

export const EditUser = (
  username,
  name,
  bio,
  publicProfile,
  profilePic,
  emailAlert
) => {
  return firebase
    .auth()
    .currentUser.updateProfile(
      // updateProfile
      {
        username: username,
        name: name,
        bio: bio,
        publicProfile: publicProfile,
        profilePic: profilePic,
        emailAlert: emailAlert,
      }
    )
    .then((cred) => {
      db.collection("users").doc(auth.currentUser.uid).update({
        username: username,
        name: name,
        bio: bio,
        publicProfile: publicProfile,
        profilePic: profilePic,
        emailAlert: emailAlert,
      });
      alert("Succes updation");
    })
    .catch((err) => {
      alert("Couldnt update!!!" + err);
    });
};

// return firebase.auth().currentUser.updateProfile({
//   name: "aaa"
//    })

//    // return firebase.auth().currentUser.updateProfile()
//    // // ({
//    // //     username: username,
//    // //     name: name,
//    // //     bio: bio,
//    // //     publicProfile: publicProfile
//    // //   })
//      .then((cred) => {
//        db.collection("users").doc(auth.currentUser.uid).set({
//          name: "vvvvvv"
//        });
//  alert("succes updation")

//      })
//      .catch((err) => {

//        alert("Couldnt update!!!"+err);

//      });
//  };

// export const userSession = (email, password) =>{
// firebase.auth().setPersistence(auth.Auth.Persistence.SESSION)
//   .then(function() {

//     return firebase.auth().signInWithEmailAndPassword(email, password);

//   })
//   .catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//   });
// };

// const signout = () => {
//   return firebase
//     .auth()
//     .signOut()
//     .then(() => {
//       setUser(false);
//     });
// };

// const sendPasswordResetEmail = email => {
//   return firebase
//     .auth()
//     .sendPasswordResetEmail(email)
//     .then(() => {
//       return true;
//     });
// };

// const confirmPasswordReset = (code, password) => {
//   return firebase
//     .auth()
//     .confirmPasswordReset(code, password)
//     .then(() => {
//       return true;
//     });
// };
