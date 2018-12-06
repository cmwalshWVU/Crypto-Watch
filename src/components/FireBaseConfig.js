import firebase from 'firebase'

var DB_CONFIG = {
    apiKey: "AIzaSyCh1_KtneWwltT15Km8ra_KnJcEjDCxs5M",
    authDomain: "crypto-monitor-55370.firebaseapp.com",
    databaseURL: "https://crypto-monitor-55370.firebaseio.com",
    projectId: "crypto-monitor-55370",
    storageBucket: "crypto-monitor-55370.appspot.com",
    messagingSenderId: "832228975479"
  };

var fire = firebase.initializeApp(DB_CONFIG);

export default fire;