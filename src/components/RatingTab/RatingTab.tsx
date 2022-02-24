import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/system';
import { State } from '../../types/state';
import { Photo } from '../../types/photo';
import usePhotos from '../../hooks/usePhotos';
import { RatingPhoto } from './RatingPhoto';
import useRating from '../../hooks/useRating';

export var RatingTab = function () {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(-1);
    const [currentPhotoRating, setCurrentPhotoRating] = useState(0);
    const [comment, setComment] = useState<string>('');
    const [chips, setChips] = useState<string[]>([]);

    const [noPhotos, setNoPhotos] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [showTags, setShowTags] = useState(false);
    const user = useSelector((state: State) => state.user.value);

    const commentRef = useRef<Element>(null);

    const { photosLoaded, getPhotos } = usePhotos();
    const { submitPhotoRating, flagPhotoAsInappropriate } = useRating();

    useEffect(() => {
        if (!user) {
            return;
        }
        if (photosLoaded && !noPhotos) return;
        getPhotos()
            .then((result: { data: Photo[] }) => {
                setPhotos(result.data);
                if (result.data && result.data.length > 0) {
                    setCurrentPhotoIndex(0);
                } else {
                    setNoPhotos(false);
                }
            })
            .catch((error: any) => {
                console.log(error);
            });

        return () => {};
    }, [user, noPhotos]);

    useEffect(() => {
        setComment('');
        setChips([]);
        setCurrentPhotoRating(0);
    }, [currentPhotoIndex]);

    const updateCurrentPhoto = () => {
        if (photos.length <= currentPhotoIndex + 1) {
            setNoPhotos(true);
            setCurrentPhotoIndex(-1);
            return;
        }
        if (noPhotos) {
            setNoPhotos(false);
            return;
        }
        setCurrentPhotoIndex(currentPhotoIndex + 1);
        window.document.body.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    const flagAsInappropriate = (photo?: Photo, reason?: string) => {
        flagPhotoAsInappropriate(photo, reason)?.then(() => {
            updateCurrentPhoto();
        });
    };

    const onRatingChange = (event: any, newValue: number | null) => {
        if (newValue === null) return;
        setCurrentPhotoRating(newValue);
        debugger;
        commentRef.current && commentRef.current?.scrollIntoView();
    };

    const handleCommentChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setComment(event.target.value);
    };

    const handleChipClicked = (text: string) => {
        if (chips.indexOf(text) === -1) {
            setChips([...chips, text]);
        } else {
            const updatedChips = chips.filter((c: string) => c != text);
            setChips(updatedChips);
        }
    };

    const submitRating = (photo?: Photo) => {
        submitPhotoRating(photo, currentPhotoRating, comment, chips)?.then(
            () => {
                updateCurrentPhoto();
            }
        );
    };

    const displayPhoto = () => {
        if (photos.length === 0 || currentPhotoIndex < 0)
            return (
                <h2>Oops! no more photos to rate, try to come back later</h2>
            );
        const currPhoto = photos[currentPhotoIndex];
        return (
            <RatingPhoto
                photo={currPhoto}
                chips={chips}
                comment={comment}
                currentPhotoRating={currentPhotoRating}
                handleChipClicked={handleChipClicked}
                handleCommentChange={handleCommentChange}
                onRatingChange={onRatingChange}
                setShowTags={setShowTags}
                showTags={showTags}
                submitRating={submitRating}
                updateCurrentPhoto={updateCurrentPhoto}
                flagAsInappropriate={flagAsInappropriate}
                commentRef={commentRef}
            />
        );
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 4,
                pb: 6
            }}
        >
            <Container maxWidth="lg">
                {photosLoaded && displayPhoto()}
                {!photosLoaded && <CircularProgress />}
            </Container>
        </Box>
    );
};
