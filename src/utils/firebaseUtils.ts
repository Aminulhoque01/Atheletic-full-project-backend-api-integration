// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey:process.env.Keyid,
//   authDomain: process.env.AuthDomain,
//   projectId: process.env.ProjectId,
//   storageBucket: process.env.StorageBucket,
//   messagingSenderId: process.env.MessagingSenderId,
//   appId: process.env.AppId,
//   measurementId:process.env.MeasurementId
// };

// const vapidkey=process.env.VapidKey;

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// const messaging= getMessaging(app);

// export const requestFCMToken = async () => {
//     return Notification.requestPermission().then(async (permission) => {
//       if (permission === "granted") {
//         return getToken(messaging, { vapidKey: vapidkey });
//       } else {
//         console.log("Unable to get permission to notify.");
//         return null;
//       }
//     }).catch((err) => {
//         console.log("Error occurred while requesting permission:", err);
//         return null;
//     })
// }

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK using environment variables

admin.initializeApp({
  credential: admin.credential.cert({
    apiKey: process.env.Keyid,
    authDomain: process.env.AuthDomain,
    projectId: process.env.ProjectId,
    storageBucket: process.env.StorageBucket,
    messagingSenderId: process.env.MessagingSenderId,
    appId: process.env.AppId,
    measurementId: process.env.MeasurementId,
    vapidKey: process.env.VapidKey,
  }),
});

module.exports = admin;
