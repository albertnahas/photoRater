import _ from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../config';
import { removeUser, setUser } from '../store/userSlice';
import { State } from '../types/state';
import { User } from '../types/user';

export const useCurrentUser = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: State) => state.user.value);
    let subscribe: any;

    const setCurrentUser = (user: User) => {
        firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((doc: any) => {
                if (doc.exists) {
                    dispatch(setUser(doc.data()));
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

    useEffect(() => {
        firebase
            .firestore()
            .collection('users')
            .doc(currentUser?.uid)
            .get()
            .then((doc: any) => {
                if (doc.exists) {
                    subscribe = doc.ref.onSnapshot((querySnapshot: any) => {
                        const updatedUser = querySnapshot.data();
                        if (!_.isEqual(currentUser, updatedUser)) {
                            dispatch(setUser(updatedUser));
                        }
                    });
                }
            })
            .catch((error: any) => {
                console.log('Error getting document:', error);
            });

        return () => {
            subscribe?.();
        };
    }, [currentUser]);

    const signOutUser = () => {
        dispatch(removeUser());
    };

    return { setCurrentUser, signOutUser };
};
