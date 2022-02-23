/* eslint-disable no-debugger */
import React, { useEffect, useState, Suspense, lazy, useRef } from 'react';
import './App.css';
import withFirebaseAuth from 'react-with-firebase-auth';
import { useDispatch, useSelector } from 'react-redux';
import firebase, { getToken, onMessageListener } from './config';
import { TopBar } from './components/TopBar/TopBar';
import { User } from './types/user';
import { State } from './types/state';
import { SplashScreen } from './molecules/SplashScreen/SplashScreen';
import { Footer } from './components/Footer/Footer';
import { useCurrentUser } from './hooks/useCurrentUser';
import { setServerUser } from './store/userSlice';
import Nav from './components/Nav/Nav';
import { useAnalytics } from './hooks/useAnalytics';

const firebaseAppAuth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');

const facebookProvider = new firebase.auth.FacebookAuthProvider();

const providers = {
    googleProvider,
    facebookProvider
};

const createComponentWithAuth = withFirebaseAuth({
    providers,
    firebaseAppAuth
});

const App = function ({
    /** These props are provided by withFirebaseAuth HOC */
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    // signInWithGithub,
    // signInWithTwitter,
    // signInAnonymously,
    signOut,
    // signInWithGoogle,
    // signInWithFacebook,
    // setError,
    user,
    error,
    loading
}: Props) {
    const currentUser = useSelector((state: State) => state.user.value);
    const { signOutUser } = useCurrentUser();
    const dispatch = useDispatch();
    const analytics = useAnalytics();

    const [deferredPrompt, setDeferredPrompt] = useState<any>();

    const [notification, setNotification] = useState({ title: '', body: '' });

    const signInWithGoogle = () => {
        analytics.submitRecord('login with google attempt');
        firebase.auth().signInWithPopup(googleProvider);
    };

    const signInWithFacebook = () => {
        analytics.submitRecord('login with facebook attempt');
        firebase.auth().signInWithPopup(facebookProvider);
    };

    firebase
        .auth()
        .getRedirectResult()
        .then((result: any) => {
            if (result.credential) {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // ...
            }
            // The signed-in user info.
            var user = result.user;
        })
        .catch((error) => {
            // Handle Errors here.
            analytics.submitRecord(error.code, error.message);

            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

    const initNotificationListener = () => {
        onMessageListener()
            .then((payload: any) => {
                setNotification({
                    title: payload.notification.title,
                    body: payload.notification.body
                });
            })
            .catch((err) => console.log('failed: ', err));
    };

    const handleInstallClick = async () => {
        if (deferredPrompt !== null) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        }
    };

    useEffect(() => {
        const handleBeforeInstallFn = (e: any) => {
            setDeferredPrompt(e);
        };

        const handleAppInstalled = (e: any) => {
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallFn);

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallFn
            );
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    useEffect(() => {
        async function initUser() {
            if (user && user.uid) {
                const messagingToken = await getToken();
                if (messagingToken) {
                    user.messagingToken = messagingToken;
                }
                dispatch(setServerUser(user));
                initNotificationListener();
            } else if (user === null) {
                signOutUser();
            }
        }
        initUser();
    }, [user]);

    const signOutFromApp = () => {
        signOut?.();
        signOutUser();
    };

    // const Nav: any = lazy(() => import('./components/Nav/Nav'));

    return currentUser === undefined ? (
        <SplashScreen />
    ) : (
        <div>
            <TopBar
                handleInstallClick={handleInstallClick}
                signOut={signOutFromApp}
                deferredPrompt={deferredPrompt}
                notification={notification}
                setNotification={setNotification}
            />
            <Nav
                createUserWithEmailAndPassword={createUserWithEmailAndPassword}
                error={error}
                loading={loading}
                signInWithEmailAndPassword={signInWithEmailAndPassword}
                signInWithGoogle={signInWithGoogle}
                signInWithFacebook={signInWithFacebook}
                signOut={signOutFromApp}
            />

            <Footer />
        </div>
    );
};

interface Props {
    signInWithEmailAndPassword?: (
        email: string,
        password: string
    ) => Promise<any>;
    createUserWithEmailAndPassword?: (
        email: string,
        password: string
    ) => Promise<any>;
    signInWithGoogle?: () => Promise<any>;
    signInWithFacebook?: () => Promise<any>;
    // signInWithGithub: PropTypes.object,
    // signInWithTwitter: PropTypes.object,
    // signInAnonymously: PropTypes.object,
    signOut?: () => Promise<any>;
    // setError: PropTypes.object,
    user?: User;
    error?: string;
    loading?: boolean;
}

export default createComponentWithAuth(App);
