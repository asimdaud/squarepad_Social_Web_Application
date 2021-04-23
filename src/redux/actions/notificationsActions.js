import * as Types from "../types";
import * as firebase from "firebase";

export const getNotificationsRedux = (uid) => {
  return (dispatch) => {
    // alert("action called");
    const firebaseUserRef = firebase.firestore().collection("users");
    console.log("notofificaction called");
    return new Promise((resolve) => {
      firebase
        .firestore()
        .collection("notifications")
        .doc(uid)
        .collection("userNotifications")
        .orderBy("time", "desc")
        .onSnapshot((querySnapshot) => {
          let chatCounter = 0;
          let totalNotifications = 0;
          const notificationsArray = [];
          querySnapshot.forEach((doc) => {
            totalNotifications = querySnapshot.size;
            // console.log("snapshot size ", querySnapshot.size);
            // console.log("user Snapshot ",doc.data().userId)

            firebaseUserRef
              .doc(doc.data().userId)
              .get()
              .then((doco) => {
                // console.log("userGet ",doco.data().username);

                let pp = {
                  avatar: doco.data().profilePic,
                  username: doco.data().username,
                  content: doc.data().content,
                  source: doc.data().source,
                  time: doc.data().time,
                  type: doc.data().type,
                  userId: doc.data().userId,
                };
                notificationsArray.push(pp);
                if (doc.data().type == "chat") {
                  chatCounter = chatCounter + 1;
                }

                // let sortedPosts = [];

                notificationsArray
                  .sort((a, b) => (a.time < b.time ? 1 : -1))
                  // .map((item, i) => {
                  //   sortedPosts.push(item);
                  // });
                // console.log(sortedPosts);

                // this.setState({ unseenChats: chatCounter });
                // this.setState({ notifications: notificationsArray });
                dispatch({
                  payload: notificationsArray,
                  type: Types.GET_NOTIFICATION_SUCCESS,
                });
                dispatch({
                  payload: chatCounter,
                  type: Types.GET_CHAT_COUNTER_SUCCESS,
                });
                dispatch({
                  payload: totalNotifications,
                  type: Types.GET_TOTAL_NOTIFICATIONS_SUCCESS,
                });
                resolve(true);
                // console.log(notificationsArray)
              });

            // console.log("userGet ",notificationsArray.time);
          });

          //here
          //sorting the notifications manually
          //         let sortedNotifications = [];
          //         notificationsArray
          //           .sort((a, b) => (a.time.seconds < b.time.seconds ? 1 : -1))
          //           .map((item, i) => {
          //             sortedNotifications.push(item);
          //           });
          //     // this.setState({ posts: sortedPosts });
          // console.log(sortedNotifications);
        });

      // .then(() => {
      //   /*localStorage.setItem(
      //       "uid",
      //       JSON.stringify(firebase.auth().currentUser.uid)
      //     );
      //     localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));*/
      //   resolve(true);
      //   dispatch({
      //     payload: notificationsArray,
      //     type: Types.GET_NOTIFICATION_SUCCESS,
      //   });
      // });
    });
  };
};

// exports.getEvent = functions.https.onRequest(async (req, res) => {
//   console.log('==NACHEINANDER STARTEN==');

//   const id = req.query.uid;
//   var arr = [];
//   var json = [];
//   let query =
//   firebase
//   .firestore()
//   .collection("notifications")
//   .doc(uid)
//   .collection("userNotifications")
//   .orderBy("time", "desc");

// await query.onSnapshot((querySnapshot) => {
//       querySnapshot.forEach(documentSnapshot => {
//           arr.push(documentSnapshot.data());
//       });
//   });
//   //console.log(arr);
// await processArray(arr)

// async function delayedLog(item) {
//   await firebase
//   .firestore()
//   .collection("users").doc(item.userId)
//   .get().then(function(doc) {
//       console.log(doc.data());
//       json.push(doc.data());
//   })

// }

// async function processArray(array) {
//   const promises = array.map(delayedLog);
//   // wait until all promises are resolved
//   await Promise.all(promises);
//   console.log('Done!');
// }

// console.log("hello");

//   res.status(200).send(JSON.stringify(json)); //, ...userData
// });
