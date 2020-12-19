// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// messaging.getToken({vapidKey: "BDWVpEf0UwqgZOMqaEPCm5K05kmeC_UQVH1qp2HSIpOZR1ihy2X2q8dikWDS7wp3dfpPZ1zKD51hHtAFjk2rZrw"})
// .then((currentToken) => {
//     if (currentToken) {
//       sendTokenToServer(currentToken);
//       updateUIForPushEnabled(currentToken);
//     } else {
//       // Show permission request.
//       console.log('No registration token available. Request permission to generate one.');
//       // Show permission UI.
//       updateUIForPushPermissionRequired();
//       setTokenSentToServer(false);
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     showToken('Error retrieving registration token. ', err);
//     setTokenSentToServer(false);
//   });