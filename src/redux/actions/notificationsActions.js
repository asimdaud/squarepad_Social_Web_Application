import * as Types from "../types";
import * as firebase from "firebase";


export const getNotificationsRedux = (uid) => {
  return (dispatch) => {
    // alert("action called");
    console.log("notofificaction called");
    return new Promise((resolve) => {
      
      firebase
      .firestore()
      .collection("notifications")
      .doc(uid)
      .collection("userNotifications")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        let chatCounter = 0;
        let totalNotifications = 0;
        const notificationsArray = [];
        snapshot.forEach((doc) => {
          totalNotifications = snapshot.size;
          firebase
          .firestore()
          .collection("users")
          .doc(doc.data().userId)
          .get()
              .then((doco) => {
                
                let pp = {
                  avatar: doco.data().profilePic,
                  content: doc.data().content,
                  source: doc.data().source,
                  time: doc.data().time,
                  type: doc.data().type,
                  userId: doc.data().userId,
                  username: doco.data().username,
                };
                notificationsArray.push(pp);
                if (doc.data().type == "chat") {
                  chatCounter = chatCounter+1;
                }

                
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
              });
              
            });
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
