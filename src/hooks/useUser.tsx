import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../config';
import { removeUser, setUser } from '../store/userSlice';
import { State } from '../types/state';
import { User } from '../types/user';

export const useUser = () => {
    const dispatch = useDispatch();

    const setCurrentUser = (user: User) => {
        firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((doc: any) => {
                if (doc.exists) {
                    doc.ref.onSnapshot((querySnapshot: any) => {
                        dispatch(setUser(querySnapshot.data()));
                    });
                } else {
                    // doc.data() will be undefined in this case
                    firebase.firestore().collection('users').doc(user.uid).set({
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        uid: user.uid
                    });
                    dispatch(setUser(user));
                }
            })
            .catch((error: any) => {
                console.log('Error getting document:', error);
            });
    };

    const updateUser = (user: User) => {
        return firebase
            .firestore()
            .collection('users')
            .doc(user?.uid)
            .update({
                ...user
            });
    };

    const signOutUser = () => {
        dispatch(removeUser());
    };

    return { setCurrentUser, signOutUser, updateUser };
};
