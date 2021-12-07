import React, { useEffect, useState } from 'react'
import firebase from "../../config"
import { Container, Box, Stack, Typography, CardContent, Card, CardActionArea, CardMedia, CardActions, Grid, Button, IconButton, Tooltip, Divider, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { UploadForm } from '../UploadForm/UploadForm'
import SwitchToggle from '../../atoms/SwitchToggle/SwitchToggle'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteCircleIcon from '@mui/icons-material/DeleteRounded';
import { useConfirm } from 'material-ui-confirm'
import RateProgressBar from '../../atoms/RateProgressBar/RateProgressBar'
import { useTheme } from '@mui/system'
import ModalDialog from '../../molecules/ModalDialog/ModalDialog'
import { PhotoDetails } from './PhotoDetails'

export const MyPhotos = () => {

    const [photos, setPhotos] = useState<any[]>([])
    const [photosLoaded, setPhotosLoaded] = useState(false)

    const [selectedPhoto, setSelectedPhoto] = useState<any>()
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false)

    const [showForm, setShowForm] = useState<boolean>(false)
    const user = useSelector((state: any) => state.user.value)
    const confirm = useConfirm();

    const theme = useTheme()

    const placeholderPhoto = 'https://monstar-lab.com/global/wp-content/uploads/sites/11/2019/04/male-placeholder-image.jpeg'
    useEffect(() => {
        if (!user) {
            return
        }

        const photosUnsubscribe = firebase.firestore().collection(`users/${user.uid}/photos`)
            .onSnapshot(function (querySnapshot: any) {
                const userPhotos: any[] = []
                querySnapshot.forEach((doc: any) => {
                    userPhotos.push(doc)
                });
                setPhotos(userPhotos)
                setPhotosLoaded(true)
                firebase.firestore().collection(`users`).doc(user.uid).update({
                    newVotes: 0
                })

            });
        return () => {
            photosUnsubscribe()
        }
    }, [user])

    const handleToggleChange = (checked: boolean, id: string, photo: any) => {
        firebase.firestore().collection(`users/${user.uid}/photos`).doc(id).update({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            active: checked
        })
    }

    const onClickDeletePhoto = (id: string) => {
        confirm({ description: 'This action is permanent!' })
            .then(() => { firebase.firestore().collection(`users/${user.uid}/photos`).doc(id).delete() })
            .catch((e: any) => { console.log(e) });

    }

    const displayPhoto = (photo?: any, id?: any) => {
        return <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => setSelectedPhoto(id)}>
                <CardMedia
                    component="img"
                    height="300"
                    image={photo ? photo.imageUrl : placeholderPhoto}
                    alt={photo ? photo.imageName : 'add'}
                />
                {photo && <CardContent>

                    <Grid container>
                        <Grid xs={9} item>
                            <RateProgressBar value={photo.rate * 20} />
                        </Grid>
                        <Grid xs={3} item>
                            <Box sx={{
                                background: theme.palette.primary.main,
                                fontSize: 11,
                                borderRadius: 1,
                                color: 'white',
                                width: 35,
                                ml: 2,
                                p: 0.2,
                            }}>
                                {photo.rate ? `${photo.rate * 2}/10` : '?'}
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
                        {photo.votesCount ? `score based on ${photo.votesCount} votes`
                            : `no votes yet on this photo`}
                    </Typography>
                </CardContent>}
                <Divider variant="middle" />
            </CardActionArea>
            <CardActions style={{ justifyContent: `${photo ? 'unset' : 'center'}` }}>
                {photo &&
                    <Grid sx={{ justifyContent: 'space-between' }} container>
                        <Tooltip title={photo.active ? `deactivate` : `activate`}>
                            <Grid style={{ alignSelf: 'center' }} item>
                                <SwitchToggle active={photo.active || false} handleToggleChange={(checked: boolean) => {
                                    handleToggleChange(checked, id, photo)
                                }} />
                            </Grid>
                        </Tooltip>
                        <Tooltip title="Delete photo">
                            <Grid item>
                                <IconButton aria-label="add" size="large" onClick={() => {
                                    onClickDeletePhoto(id)
                                }}>
                                    <DeleteCircleIcon />
                                </IconButton>
                            </Grid>
                        </Tooltip>

                    </Grid>
                }
                {!photo &&
                    <Tooltip title="Add photo">
                        <IconButton aria-label="delete" size="large" onClick={() => setShowForm(sf => !sf)}>
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>}
            </CardActions>
        </Card >
    }

    const displayPhotos = () => {
        return photos.map((p: any) => {
            const photo = p.data()
            return <Grid key={p.id} item sx={{ p: 1 }} xs={12} md={3}>
                {displayPhoto(photo, p.id)}
            </Grid >
        })

    }

    useEffect(() => {
        if (selectedPhoto) {
            setOpenPhotoDialog(true)
        }
    }, [selectedPhoto])

    useEffect(() => {
        if (!openPhotoDialog) {
            setSelectedPhoto(null)
        }
    }, [openPhotoDialog])

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 4,
                pb: 6,
            }}
        >
            <Container maxWidth="lg">
                {showForm && <>
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
                    <UploadForm onCancel={() => setShowForm(false)} />
                </>}
                {!showForm && <Grid sx={{
                    pl: { xs: 2 },
                    pr: { xs: 2 },
                }} container>
                    {displayPhotos()}
                    <Grid item sx={{ p: 1 }} xs={12} md={3}>
                        {displayPhoto()}
                    </Grid >
                </Grid>}
            </Container>
            {!photosLoaded && <CircularProgress />}
            <ModalDialog open={openPhotoDialog} setOpen={setOpenPhotoDialog}>
                <PhotoDetails photoId={selectedPhoto} />
            </ModalDialog>
        </Box>
    )
}
