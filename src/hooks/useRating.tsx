import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../types/state';
import firebase from '../config';
import { Photo } from '../types/photo';

const useRating = () => {
    const user = useSelector((state: State) => state.user.value);

    const submitPhotoRating = (
        photo?: Photo | undefined,
        rating?: number | undefined,
        comment?: string | undefined,
        chips?: string[] | undefined
    ) => {
        if (!rating) {
            return;
        }
        const voteObj = {
            userId: user?.uid,
            rate: rating,
            comment,
            chips,
            ratedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        return firebase
            .firestore()
            .collection(`users/${photo?.userId}/photos/${photo?.id}/votes`)
            .add(voteObj);
    };

    return {
        submitPhotoRating
    };
};

export default useRating;
