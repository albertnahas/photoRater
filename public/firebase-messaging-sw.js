// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: 'AIzaSyDEoVx6711d0M50SVUmXhejuO8shhzFC8I',
    authDomain: 'photorater-c5c6a.firebaseapp.com',
    projectId: 'photorater-c5c6a',
    storageBucket: 'photorater-c5c6a.appspot.com',
    messagingSenderId: '1564450420',
    appId: '1:1564450420:web:2b0bf08fd2f76c8e66bb21',
    measurementId: 'G-6232FMVPW3'
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});