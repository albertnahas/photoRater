/* eslint-disable no-debugger */
import React, { useEffect, useState } from 'react';
import './App.css';
import withFirebaseAuth from 'react-with-firebase-auth';
import { useDispatch, useSelector } from 'react-redux';
import firebase from './config';
import { TopBar } from './components/TopBar/TopBar';
import { User } from './types/user';
import { State } from './types/state';
import { SplashScreen } from './molecules/SplashScreen/SplashScreen';
import { Footer } from './components/Footer/Footer';
import { Nav } from './components/Nav/Nav';
import { useCurrentUser } from './hooks/useCurrentUser';
import { setServerUser } from './store/userSlice';

const firebaseAppAuth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read');

const providers = {
    googleProvider,
    facebookProvider: new firebase.auth.FacebookAuthProvider()
};

const createComponentWithAuth = withFirebaseAuth({
    providers,
    firebaseAppAuth
});

const App = function ({
    /** These props are provided by withFirebaseAuth HOC */
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithGoogle,
    signInWithFacebook,
    // signInWithGithub,
    // signInWithTwitter,
    // signInAnonymously,
    signOut,
    // setError,
    user,
    error,
    loading
}: Props) {
    const currentUser = useSelector((state: State) => state.user.value);
    const { signOutUser } = useCurrentUser();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && user.uid) {
            dispatch(setServerUser(user));
        } else if (user === null) {
            signOutUser();
        }
    }, [user]);

    const signOutFromApp = () => {
        signOut?.();
        signOutUser();
    };

    return currentUser === undefined ? (
        <SplashScreen />
    ) : (
        <div>
            <TopBar signOut={signOutFromApp} />
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
