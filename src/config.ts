// Import the functions you need from the SDKs you need
import firebase from 'firebase';
import 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDEoVx6711d0M50SVUmXhejuO8shhzFC8I',
    authDomain: 'photorater-c5c6a.firebaseapp.com',
    projectId: 'photorater-c5c6a',
    storageBucket: 'photorater-c5c6a.appspot.com',
    messagingSenderId: '1564450420',
    appId: '1:1564450420:web:2b0bf08fd2f76c8e66bb21',
    measurementId: 'G-6232FMVPW3'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
if (location.hostname === 'localhost') {
    firebase.firestore().useEmulator('localhost', 8080);
    firebase.functions().useEmulator('localhost', 5001);
}
const storage = firebase.storage();
export default firebase;
