import React, { useEffect, useRef, useState } from 'react'
import firebase from "../../config"
import { Container, Box, Stack, Typography, CardContent, Card, CardActionArea, CardMedia, CardActions, Grid, Button, IconButton, Paper, TextField, Chip, Divider, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import PhotoRating from '../../atoms/PhotoRating/PhotoRating'
import { tags } from '../../utils/utils';
import { cloneDeep } from 'lodash'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTheme } from '@mui/system'

const functions = firebase.functions()

export const RatingTab = () => {

    const [photos, setPhotos] = useState<any[]>([])
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<any>(-1)
    const [currentPhotoRating, setCurrentPhotoRating] = useState(0)
    const [comment, setComment] = useState<string>('')
    const [chips, setChips] = useState<string[]>([])

    const [noPhotos, setNoPhotos] = useState(true)
    const [photosLoaded, setPhotosLoaded] = useState(false)

    const [showTags, setShowTags] = useState(false)
    const user = useSelector((state: any) => state.user.value)


    const theme = useTheme()

    useEffect(() => {
        if (!user) {
            return
        }
        if (photosLoaded && !noPhotos)
            return
        console.log('getPhotos')
        const getPhotos = functions.httpsCallable('getPhotos')
        getPhotos({ userId: user.uid }).then((result: any) => {

            setPhotos(result.data)
            setCurrentPhotoIndex(0)
            setPhotosLoaded(true)

        }).catch((error: any) => {
            console.log(error);
        })

        return () => {
        }

    }, [user, noPhotos])

    useEffect(() => {
        setComment('')
        setChips([])
        setCurrentPhotoRating(0)
    }, [currentPhotoIndex])

    const updateCurrentPhoto = () => {
        if (photos.length <= currentPhotoIndex + 1) {
            setNoPhotos(true)
            setCurrentPhotoIndex(-1)
            return
        } else if (!noPhotos) {
            setNoPhotos(false)
        }
        setCurrentPhotoIndex(currentPhotoIndex + 1)
    }

    const onRatingChange = (event: any, newValue: any) => {
        if (newValue === null) return
        setCurrentPhotoRating(newValue)
    }

    const handleCommentChange = (event: any) => {
        setComment(event.target.value)
    }

    const handleChipClicked = (text: string) => {
        if (chips.indexOf(text) === -1) {
            setChips([...chips, text])
        } else {
            const updatedChips = chips.filter((c: string) => c != text)
            setChips(updatedChips)
        }
    }

    const submitRating = (photo: any, id: any) => {
        if (!currentPhotoRating) {
            return
        }
        const voteObj = {
            userId: user.uid,
            rate: currentPhotoRating,
            comment,
            chips,
            ratedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
        firebase.firestore().collection(`users/${photo.userId}/photos/${id}/votes`).add(voteObj);
        updateCurrentPhoto()
    }

    const displayPhoto = (photo?: any) => {
        const id = photo.id
        return <Container maxWidth="lg">
            <Grid container>
                <Grid item md={4}>
                    <Paper elevation={3} >
                        <img style={{ width: '100%', marginBottom: -4 }} src={photo.imageUrl} />
                    </Paper>
                </Grid>

                <Grid item md={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ m: 2 }} variant="h6" color="text.secondary">
                            How attractive you think the person is in this photo?
                        </Typography>
                        <PhotoRating value={currentPhotoRating} onRatingChange={onRatingChange} />
                        <TextField sx={{
                            width:
                            {
                                md: '70%',
                                xs: '100%',
                            },
                            m: 4
                        }}
                            id="outlined-basic"
                            label="Comment"
                            variant="outlined"
                            onChange={handleCommentChange}
                            value={comment} />
                        <Stack direction="row" sx={{
                            width:
                            {
                                md: '70%',
                                xs: '100%',
                            },
                            flexWrap: 'wrap',
                            gap: '6px'
                        }} spacing={0}>
                            {tags.map((t: string, i: number) => {
                                if (i < 15 || showTags) {
                                    const active = chips.indexOf(t) !== -1
                                    return <Chip
                                        sx={{
                                            backgroundColor: `${active ? '#999' : '#eee'}`,
                                            color: `${active ? '#fff' : 'inherit'}`,
                                        }}
                                        onClick={() => handleChipClicked(t)} key={t} label={t} />
                                }
                            }
                            )}
                            <Button style={{ textTransform: "none" }}
                                variant="text" color="secondary" component="span"
                                onClick={() => setShowTags(f => !f)}>
                                {showTags ? 'hide' : 'show more'}
                            </Button>
                        </Stack>
                        <Divider style={{ width: '70%', alignSelf: 'center', margin: 16 }} variant="middle" />

                        <Button aria-label="add" color="primary" variant="text" size="large" endIcon={<SendRoundedIcon />}
                            onClick={() => {
                                submitRating(photo, id)
                            }}>
                            Rate
                        </Button>
                        <Divider style={{ width: '70%', alignSelf: 'center', margin: 16 }} variant="middle" />

                        <Button variant="text" color="secondary" size="small"
                            endIcon={<SkipNextIcon />}
                            component="span"
                            onClick={updateCurrentPhoto}>
                            Skip
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    }

    const displayPhotos = () => {
        if (photos.length === 0 || currentPhotoIndex < 0) return <h2>Oops! no more photos to rate, try to come back later</h2>
        const currPhoto = photos[currentPhotoIndex]
        return displayPhoto(currPhoto)
    }

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                pt: 4,
                pb: 6,
            }}
        >
            <Container maxWidth="lg">
                
                {photosLoaded && displayPhotos()}
                {!photosLoaded && <CircularProgress />}
            </Container>
        </Box >
    )
}
