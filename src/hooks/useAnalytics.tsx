import React from 'react';
import { useSelector } from 'react-redux';
import firebase from '../config';
import { State } from '../types/state';
import { User } from '../types/user';

export const useAnalytics = () => {
    const user = useSelector((state: State) => state.user.value);

    const submitRecord = (type?: string, description?: string) => {
        // return firebase
        //     .firestore()
        //     .collection('analytics')
        //     .add({
        //         type: type || '',
        //         description: description || '',
        //         user: user?.uid || null
        //     });
    };

    return { submitRecord };
};
