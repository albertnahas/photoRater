import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import ModalDialog from '../../molecules/ModalDialog/ModalDialog';
import { PhotoDetails } from './PhotoDetails';
import { UploadFormContainer } from '../Profile/UploadForm/UploadFormContainer';
import useUserPhotos from '../../hooks/useUserPhotos';
import { PhotoCard } from './PhotoCard';

export var MyPhotos = function () {
    const [view, setView] = useState('classic');

    const [selectedPhoto, setSelectedPhoto] = useState<string | null>();
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
    const [showForm, setShowForm] = useState<boolean>(false);

    const { photos, photosLoaded, photoUtils } = useUserPhotos();

    const displayPhotos = () =>
        photos.map((p: any) => {
            const photo = p.data();
            return (
                <Grid
                    key={p.id}
                    item
                    sx={{ p: 1 }}
                    xs={view !== 'two-col' ? 12 : 6}
                    md={3}
                >
                    <PhotoCard
                        view={view}
                        photo={photo}
                        onClickPhoto={() =>
                            photo
                                ? setSelectedPhoto(p.id)
                                : setShowForm((sf) => !sf)
                        }
                        handleToggleChange={(checked: boolean) => {
                            photoUtils.changePhotoStatus(checked, p.id || '');
                        }}
                        onDeletePhoto={() => {
                            photoUtils.deletePhoto(p.id);
                        }}
                    />
                </Grid>
            );
        });

    useEffect(() => {
        if (selectedPhoto) {
            setOpenPhotoDialog(true);
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
        pl: { xs: 2, md: 0 },
        pr: { xs: 2, md: 0 },
        mb: 1
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
                        <Box sx={containerStyle}>
                            {photosLoaded &&
                                photos.filter((p) => p.data().active).length ===
                                    0 && (
                                    <Alert severity="info">
                                        {photos.length === 0
                                            ? 'Start uploading your photos here'
                                            : 'Activate your photo using the switch button to start receiving votes'}
                                    </Alert>
                                )}
                        </Box>
                        <Grid sx={containerStyle} container>
                            {displayPhotos()}
                            <Grid item sx={{ p: 1 }} xs={12} md={3}>
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
            <ModalDialog open={openPhotoDialog} setOpen={setOpenPhotoDialog}>
                <PhotoDetails photoId={selectedPhoto} />
            </ModalDialog>
        </Box>
    );
};
