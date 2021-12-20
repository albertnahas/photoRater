import _ from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../config';
import { removeUser, setUser, setServerUser } from '../store/userSlice';
import { State } from '../types/state';
import { User } from '../types/user';
import { useAnalytics } from './useAnalytics';

export const useCurrentUser = () => {
    const dispatch = useDispatch();

    const serverUser = useSelector((state: State) => state.user.serverValue);
    const analytics = useAnalytics();

    useEffect(() => {
        if (!serverUser) {
            return;
        }

        const user = serverUser;
        firebase
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((doc: any) => {
                if (!doc.exists) {
                    firebase
                        .firestore()
                        .collection('users')
                        .doc(user.uid)
                        .set({
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            uid: user.uid,
                            messagingToken: user.messagingToken || null
                        });
                } else if (!doc.data().messagingToken && user.messagingToken) {
                    doc.ref.update({ messagingToken: user.messagingToken });
                }
            })
            .catch((error: any) => {
                console.log('Error getting document:', error);
                analytics.submitRecord(error);
            });

        const subscribe = firebase
            .firestore()
            .collection('users')
            .doc(serverUser?.uid)
            .onSnapshot((querySnapshot: any) => {
                const updatedUser = querySnapshot.data();
                dispatch(setUser(updatedUser));
            });

        return () => {
            subscribe?.();
        };
    }, [serverUser]);

    const signOutUser = () => {
        dispatch(removeUser());
    };

    return { signOutUser };
};
