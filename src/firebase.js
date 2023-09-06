import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

firebase.initializeApp({
  apiKey: "AIzaSyBxIWpSZ0Zrqk7FtNTBKlnzKF-ZP0eAYis",
  authDomain: "gartic-clone.firebaseapp.com",
  projectId: "gartic-clone",
  storageBucket: "gartic-clone.appspot.com",
  messagingSenderId: "596676281429",
  appId: "1:596676281429:web:ac411cd26a7f85e74fc0dc"
});

export const db = firebase.firestore();
export const auth = firebase.auth();