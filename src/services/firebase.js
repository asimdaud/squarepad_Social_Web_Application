import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBaJn7k8fOtEvzKoV4wjNXe6YGz6nmlt50",
  authDomain: "squarepad-demo-fix.firebaseapp.com",
  projectId: "squarepad-demo-fix",
  storageBucket: "squarepad-demo-fix.firebasestorage.app",
  messagingSenderId: "804968652017",
  appId: "1:804968652017:web:265c714385c4774861dd50",
  measurementId: "G-NDES2PB1TW",
};

const app = initializeApp(firebaseConfig);

let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {
    analytics = null;
  });

export { app, analytics, firebaseConfig };
