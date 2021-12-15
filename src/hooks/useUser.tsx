import React from 'react';
import firebase from '../config';
import { User } from '../types/user';

export const useUser = () => {
    const updateUser = (user: User) => {
        return firebase
            .firestore()
            .collection('users')
            .doc(user?.uid)
            .update({
                ...user
            });
    };

    return { updateUser };
};