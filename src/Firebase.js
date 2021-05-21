import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA1cM1o06DQQZwPUH1xAbrA0Va4SQM1dA8",
    authDomain: "insta-alike-app.firebaseapp.com",
    projectId: "insta-alike-app",
    storageBucket: "insta-alike-app.appspot.com",
    messagingSenderId: "953171747880",
    appId: "1:953171747880:web:502cdb91885f25b89cc11d"
});

const auth = firebase.auth();
const storage = firebase.storage();
const db = firebaseApp.firestore();
export default db;
export { db, auth, storage }