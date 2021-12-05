import React, { useEffect, useState } from 'react'
import './UploadForm.css'
import firebase from "../../config"
import { Button, Box, Grid, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Slider, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import CollectionsIcon from '@mui/icons-material/Collections';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/system'

const storage = firebase.storage()

export const UploadForm = (props: any) => {

    const [imageAsFile, setImageAsFile] = useState<any>()
    const [imageAsUrl, setImageAsUrl] = useState<any>('')
    const [showToGender, setShowToGender] = useState('both')
    const [ageRange, setAgeRange] = useState([18, 37]);
    const [uploading, setUploading] = useState<any>(false)
    const user = useSelector((state: any) => state.user.value)

    const theme = useTheme()

    const handleImageAsFile = (e: any) => {
        const image = e.target.files[0]
        setImageAsFile((imageFile: any) => (image))
        setImageAsUrl({ imgUrl: URL.createObjectURL(image) })
    }

    const handlePhotoSubmit = (e: any) => {
        e.preventDefault()
        console.log('start of upload')
        // async magic goes here...
        if (!imageAsFile || imageAsFile === '') {
            console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
        }
        else {
            const uploadTask = storage.ref(`/images/${user.uid}/${imageAsFile?.name}`).put(imageAsFile)
            uploadTask.on('state_changed',
                (snapShot: any) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot)
                    console.log('uploading')
                    setUploading(true)

                }, (err: any) => {
                    //catches the errors
                    console.log(err)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref(`images/${user.uid}`).child(imageAsFile?.name).getDownloadURL()
                        .then((fireBaseUrl: string) => {
                            setImageAsUrl((prevObject: any) => ({ ...prevObject, imgUrl: fireBaseUrl }))
                            firebase.firestore().collection(`users/${user.uid}/photos`).add({
                                imageName: imageAsFile?.name,
                                imageUrl: fireBaseUrl,
                                userId: user.uid,
                                showTo: showToGender,
                                ageRange: ageRange,
                                uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            });
                            setUploading(false)
                            props.onCancel()
                        })
                })
        }

    }

    const handleShowToGenderChange = (event: any) => {
        setShowToGender(event.target.value)
    }

    const minDistance = 10;
    const handleAgeRangeChange = (event: any, newValue: any, activeThumb: any) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setAgeRange([Math.min(newValue[0], ageRange[1] - minDistance), ageRange[1]])
        } else {
            setAgeRange([ageRange[0], Math.max(newValue[1], ageRange[0] + minDistance)])
        }
    }

    return (
        <form style={{ width: '100%' }} onSubmit={handlePhotoSubmit}>
            <Box sx={{
                display: imageAsUrl ? `none` : `block`,
            }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageAsFile}
                    style={{ display: 'none' }}
                    id="contained-button-file"
                />
                <label htmlFor="contained-button-file">
                    <Button startIcon={<CollectionsIcon />} variant="contained" color="primary" component="span">
                        Choose photo
                    </Button>
                </label>
            </Box>

            {imageAsUrl &&
                <Grid sx={{
                    textAlign: 'left',
                    [theme.breakpoints.up('md')]: {
                        width: '75%',
                        margin: 'auto'
                    }
                }}
                    spacing={4}
                    container>
                    <Grid xs={12} md={4} item>
                        <Paper elevation={3} >
                            <img width="100"
                                style={{ width: '100%', margin: 'auto', marginBottom: -4 }}
                                src={imageAsUrl.imgUrl}
                                alt="image tag" />
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={8} item>
                        <Box sx={{ mb: 2 }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Show this photo to</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    name="row-radio-buttons-group"
                                    value={showToGender}
                                    onChange={handleShowToGenderChange}>
                                    <FormControlLabel value="female" control={<Radio size="small" />} label="Females" />
                                    <FormControlLabel value="male" control={<Radio size="small" />} label="Males" />
                                    <FormControlLabel value="both" control={<Radio size="small" />} label="Both" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <FormControl sx={{
                                width: 
                                {
                                    md: '80%',
                                    xs: '100%',
                                },
                            }} component="fieldset">
                                <FormLabel component="legend">Age within</FormLabel>
                                <Slider
                                    size="small"
                                    getAriaLabel={() => 'Minimum distance'}
                                    value={ageRange}
                                    onChange={handleAgeRangeChange}
                                    valueLabelDisplay="on"
                                    disableSwap
                                    sx={{ mt: 5 }}
                                />
                            </FormControl>
                        </Box>


                    </Grid>
                </Grid>
            }

            {imageAsUrl && !uploading && <Button startIcon={<CloudUploadOutlinedIcon />} type="submit" variant="outlined">Upload</Button>}
            {!uploading && <Box sx={{ mt: 2 }}>
                <Button type="button" variant="outlined" onClick={props.onCancel}>Cancel</Button>
            </Box>}
            {uploading && <CircularProgress />}
        </form>
    )
}
