const firebase = require('firebase');

firebase.initializeApp({
  apiKey: 'AIzaSyAhq4RbzLbRx6SxEPJaSzmYFSfTO5NcZl8',
  authDomain: 'neosmartblinds.firebaseapp.com',
  databaseURL: 'https://neosmartblinds.firebaseio.com',
  storageBucket: 'neosmartblinds.appspot.com',
  messagingSenderId: '605176182079',
});

const auth = firebase.auth();
const db = firebase.database().ref();

export { auth, db };
