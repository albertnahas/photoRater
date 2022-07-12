import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../types/state';
import firebase from '../config';
import { Photo } from '../types/photo';
import { UserVote } from '../types/user';
import _ from 'lodash';

const usePhotos = () => {
    const functions = firebase.functions();
    const photosLimit = 12;
    const user = useSelector((state: State) => state.user.value);
    const [hasMore, setHasMore] = useState(true);
    const [photosLoaded, setPhotosLoaded] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);

    const [votes, setVotes] = useState<UserVote[]>([]);
    const [votesLoaded, setVotesLoaded] = useState(false);
    const loading = useRef(false);
    const lastId = useRef<any>(null);

    const loadPhotos = (refresh?: boolean) => {
        return new Promise((resolve, reject) => {
            if (!user || !votesLoaded || loading.current) {
                resolve(false);
                return;
            }
            setPhotosLoaded(false);
            loading.current = true;

            let query: firebase.firestore.Query<firebase.firestore.DocumentData> =
                firebase
                    .firestore()
                    .collectionGroup(`photos`)
                    .where('active', '==', true)
                    .orderBy('id', 'desc')
                    .orderBy('gender');

            if (!refresh && lastId.current) {
                query = query.startAfter(lastId.current);
            }
            if (user.showGender !== 'both') {
                query = query.where('gender', '==', user.showGender);
            }

            return query
                .limit(photosLimit)
                .get()
                .then((querySnapshot: any) => {
                    const fetchedPhotos: Photo[] = [];
                    querySnapshot?.forEach((doc: any) => {
                        if (
                            doc.data().userId !== user.uid &&
                            (!votes ||
                                votes.map((v) => v.id).indexOf(doc.id) ===
                                    -1) &&
                            (!user.blocks ||
                                user.blocks.indexOf(doc.id) === -1) &&
                            (doc.data().showTo === 'both' ||
                                doc.data().showTo === user.gender)
                        ) {
                            fetchedPhotos.push({
                                id: doc.id,
                                ...doc.data()
                            });
                        }

                        lastId.current = doc;
                    });
                    if (!fetchedPhotos.length) {
                        setHasMore(false);
                    } else {
                        setPhotos((prevPhotos) => [
                            ...prevPhotos,
                            ...fetchedPhotos
                            // ..._.shuffle(fetchedPhotos)
                        ]);
                    }
                    setPhotosLoaded(true);
                    loading.current = false;
                    resolve(true);
                })
                .catch((error: any) => {
                    console.log('error', error);
                    loading.current = false;
                    reject(error);
                });
        });
    };

    useEffect(() => {
        const votesUnsubscribe = firebase
            .firestore()
            .collection(`users/${user?.uid}/votes`)
            .onSnapshot((querySnapshot: any) => {
                const userVotes: UserVote[] = [];
                querySnapshot.forEach((doc: any) => {
                    userVotes.push({ id: doc.id, ...doc.data() });
                });
                setVotes(userVotes);
                setVotesLoaded(true);
            });
        return () => {
            votesUnsubscribe();
        };
    }, [user]);

    useEffect(() => {
        loadPhotos();
    }, [user?.uid, votesLoaded]);

    const getPhotos = () => {
        const getPhotosCallable = functions.httpsCallable('getPhotos');
        return getPhotosCallable({ userId: user?.uid }).then(
            (res: { data: Photo[] }) => {
                setPhotosLoaded(true);
                return new Promise<{ data: Photo[] }>((resolve, reject) => {
                    resolve(res);
                });
            }
        );
    };

    return {
        hasMore,
        photos,
        votes,
        votesLoaded,
        getPhotos,
        photosLoaded,
        loadPhotos
    };
};

export default usePhotos;
