// Import the functions you need from the SDKs you need
import firebase from "firebase"
import "firebase/storage"
import "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEoVx6711d0M50SVUmXhejuO8shhzFC8I",
  authDomain: "photorater-c5c6a.firebaseapp.com",
  projectId: "photorater-c5c6a",
  storageBucket: "photorater-c5c6a.appspot.com",
  messagingSenderId: "1564450420",
  appId: "1:1564450420:web:2b0bf08fd2f76c8e66bb21",
  measurementId: "G-6232FMVPW3",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// if (location.hostname === 'localhost') {
//     firebase.firestore().useEmulator('localhost', 8080);
//     firebase.functions().useEmulator('localhost', 5001);
// }
let messaging: any

try {
  messaging = firebase.messaging()
} catch (error) {
  console.log(error)
}

export const getToken = () => {
  if (!messaging) return
  return messaging
    .getToken({
      vapidKey:
        "BB-ZtExWjS9k8CCdK1gMs-adp2YAzKC7jAK53xD4BgiFP--4AvHUt3ZPI0oKeg1ALVz7VY85mEVNkAF_Dm45B2I",
    })
    .then((currentToken: any) => {
      if (currentToken) {
        return currentToken
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        return undefined
        // shows on the UI that permission is required
      }
    })
    .catch((err: any) => {
      console.log("An error occurred while retrieving token. ", err)
      // catch error while creating client token
    })
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging &&
      messaging.onMessage((payload: any) => {
        resolve(payload)
      })
  })

export default firebase
