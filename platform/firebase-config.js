// Firebase compat SDK — loaded via CDN before this script
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDuErikHul-5eREA87ea_va1XgjgmXB34M",
    authDomain: "tabletennis-community.firebaseapp.com",
    projectId: "tabletennis-community",
    storageBucket: "tabletennis-community.firebasestorage.app",
    messagingSenderId: "816767387756",
    appId: "1:816767387756:web:101281d898825b4d347049"
  });
}
const db      = firebase.firestore();
const storage = firebase.storage();
