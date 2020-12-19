// const functions = require('firebase-functions');

// const admin = require("firebase-admin");


// admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //   functions.logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });


// const createCommentNotification = (notification) => {
//     return admin
//       .firestore()
//       .collection("notifications")
//       .doc(`${notification.ss}`)
//       .collection("userNotifications")
//       .add(notification)
//       .then((doc) => console.log("notification added", notification));
//   };

//   exports.listenComments = functions.firestore
//   .document("comments/{postId}/userComments/{userCommentId}")
// //   .document("posts/{postUserId}/userPosts/{postId}/comments/{userCommentId}")
//   .onCreate((doc, context) => {
//     // const comment = doc.data();
//     const notification = {
//       type: "comment",
//       content: "Commented on your post",
//     //   postId: `${context.params.postId}`,
//     //   user: `${comment.username}`,
//     //   userId: `${comment.userId}`,
//     //   postUserId: `${comment.userId}`,
//       time: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     return createCommentNotification(notification);
//   });




