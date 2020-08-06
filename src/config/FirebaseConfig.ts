import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCl9BC8qKRb6lHKwaZA4twejYyLppCCDJc",
  authDomain: "chatapp-87fea.firebaseapp.com",
  databaseURL: "https://chatapp-87fea.firebaseio.com",
  projectId: "chatapp-87fea",
  storageBucket: "chatapp-87fea.appspot.com",
  messagingSenderId: "150418350632",
  appId: "1:150418350632:web:b8bb7e31a0607a901e4b1d",
  measurementId: "G-FT4C745WZ5",
};

export default async function firebaseInit() {
  await firebase.initializeApp(firebaseConfig);
}
