import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Zoom
} from '@mui/material';
import ModalDialog from '../../molecules/ModalDialog/ModalDialog';
import { PhotoDetails } from './PhotoDetails';
import { UploadFormContainer } from '../Profile/UploadForm/UploadFormContainer';
import useUserPhotos, { PhotoState, sort } from '../../hooks/useUserPhotos';
import { PhotoCard } from './PhotoCard';
import { SortByControl } from '../../atoms/SortByControl/SortByControl';
import { Photo } from '../../types/photo';
import { PhotoActions } from './PhotoActions';
import { useSelector } from 'react-redux';
import { State } from '../../types/state';

export var MyPhotos = function () {
    const [view, setView] = useState('classic');
    const user = useSelector((state: State) => state.user.value);

    const [selectedPhoto, setSelectedPhoto] = useState<PhotoState | null>();
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
    const [showForm, setShowForm] = useState<boolean>(false);

    const { photos, photosLoaded, photoUtils, sortBy, setSortBy } =
        useUserPhotos();

    const displayPhotos = () =>
        photos.map((p: any) => {
            const photo = p.data();
            return (
                <Grid key={p.id} item xs={view !== 'two-col' ? 12 : 6} md={3}>
                    <PhotoCard
                        view={view}
                        photo={photo}
                        photoId={p.id}
                        onClickPhoto={() =>
                            photo
                                ? setSelectedPhoto(p)
                                : setShowForm((sf) => !sf)
                        }
                    />
                </Grid>
            );
        });

    useEffect(() => {
        // syc selectedPhoto
        if (selectedPhoto) {
            const updatedPhoto = photos.find((p) => selectedPhoto?.id === p.id);
            setSelectedPhoto(updatedPhoto || null);
        }
    }, [photos]);

    useEffect(() => {
        if (selectedPhoto) {
            setOpenPhotoDialog(true);
        } else {
            setOpenPhotoDialog(false);
        }
    }, [selectedPhoto]);

    useEffect(() => {
        if (!openPhotoDialog) {
            setSelectedPhoto(null);
        }
    }, [openPhotoDialog]);

    const onToggleForm = () => setShowForm((sf) => !sf);
    const onHideForm = () => setShowForm(false);

    const containerStyle = {
        mb: 2
    };

    const controlsContainerStyle = {
        mb: 2,
        mt: 2,
        display: 'flex'
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 2,
                pb: 6,
                pl: { xs: 2, md: 0 },
                pr: { xs: 2, md: 0 }
            }}
        >
            <Container maxWidth="lg">
                {showForm && (
                    <>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            sx={{ mb: 2 }}
                        >
                            New Photo
                        </Typography>
                        <UploadFormContainer onCancel={onHideForm} />
                    </>
                )}
                {!showForm && (
                    <>
                        <Box sx={{ ...containerStyle, textAlign: 'left' }}>
                            {photosLoaded &&
                                photos.filter((p) => p.data().active).length ===
                                    0 &&
                                !!user?.points && (
                                    <Alert severity="info">
                                        {photos.length === 0
                                            ? 'Start uploading your photos here'
                                            : 'Activate your photo using the switch button to start receiving votes'}
                                    </Alert>
                                )}
                            {photosLoaded && !user?.points && (
                                <Alert sx={{ my: 1 }} severity="error">
                                    You can&apos;t activate your photos because
                                    you ran out of tokens, please rate other
                                    photos, or buy some from your profile page
                                </Alert>
                            )}
                        </Box>
                        {photosLoaded && (
                            <Box sx={controlsContainerStyle}>
                                <SortByControl
                                    value={sortBy}
                                    onChange={(value: sort) => {
                                        setSortBy(value);
                                    }}
                                />
                            </Box>
                        )}
                        <Grid sx={containerStyle} spacing={2} container>
                            {displayPhotos()}
                            <Grid item xs={12} md={3}>
                                <PhotoCard
                                    onClickShowForm={onToggleForm}
                                    view={view}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
            {!photosLoaded && <CircularProgress />}
            <ModalDialog
                closeButton={true}
                open={openPhotoDialog}
                setOpen={setOpenPhotoDialog}
                actions={
                    <PhotoActions
                        photoId={selectedPhoto?.id}
                        active={selectedPhoto?.data().active}
                        condensed={true}
                    />
                }
            >
                <PhotoDetails photoId={selectedPhoto?.id} />
            </ModalDialog>
        </Box>
    );
};
