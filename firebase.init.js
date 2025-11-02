/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXiT9d06lZrgcD-kxmvypW6bNwTjG3WvY",
  authDomain: "code-guard-e9894.firebaseapp.com",
  projectId: "code-guard-e9894",
  storageBucket: "code-guard-e9894.firebasestorage.app",
  messagingSenderId: "734189850701",
  appId: "1:734189850701:web:7bd4c72e12b0d619534c04",
  measurementId: "G-82BJJY0HQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the initialized app
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);