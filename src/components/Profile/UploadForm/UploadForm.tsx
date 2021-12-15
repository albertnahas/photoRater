import React, { FC } from 'react';
import {
    Button,
    Box,
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Slider,
    Paper,
    CircularProgress
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useTheme } from '@mui/system';
import firebase from '../../../config';

export var UploadForm: FC<Props> = function ({
    onCancel,
    uploading,
    handlePhotoSubmit,
    imageAsUrl,
    handleImageAsFile,
    ageRange,
    handleAgeRangeChange,
    showToGender,
    handleShowToGenderChange
}) {
    const theme = useTheme();

    return (
        <form style={{ width: '100%' }} onSubmit={handlePhotoSubmit}>
            <Box
                sx={{
                    display: imageAsUrl ? 'none' : 'block'
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageAsFile}
                    style={{ display: 'none' }}
                    id="contained-button-file"
                />
                <label htmlFor="contained-button-file">
                    <Button
                        startIcon={<CollectionsIcon />}
                        variant="contained"
                        color="primary"
                        component="span"
                    >
                        Choose photo
                    </Button>
                </label>
            </Box>

            {imageAsUrl && (
                <Grid
                    sx={{
                        textAlign: 'left',
                        [theme.breakpoints.up('md')]: {
                            width: '75%',
                            margin: 'auto'
                        }
                    }}
                    spacing={4}
                    container
                >
                    <Grid xs={12} md={4} item>
                        <Paper elevation={3}>
                            <img
                                width="100"
                                style={{
                                    width: '100%',
                                    margin: 'auto',
                                    marginBottom: -4
                                }}
                                src={imageAsUrl.imgUrl}
                                alt="new image"
                            />
                        </Paper>
                    </Grid>
                    <Grid xs={12} md={8} item>
                        <Box sx={{ mb: 2 }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    Show this photo to
                                </FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    name="row-radio-buttons-group"
                                    value={showToGender}
                                    onChange={handleShowToGenderChange}
                                >
                                    <FormControlLabel
                                        value="female"
                                        control={<Radio size="small" />}
                                        label="Females"
                                    />
                                    <FormControlLabel
                                        value="male"
                                        control={<Radio size="small" />}
                                        label="Males"
                                    />
                                    <FormControlLabel
                                        value="both"
                                        control={<Radio size="small" />}
                                        label="Both"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <FormControl
                                sx={{
                                    width: {
                                        md: '80%',
                                        xs: '100%'
                                    }
                                }}
                                component="fieldset"
                            >
                                <FormLabel component="legend">
                                    Age within
                                </FormLabel>
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
            )}

            {imageAsUrl && !uploading && (
                <Button
                    startIcon={<CloudUploadOutlinedIcon />}
                    type="submit"
                    variant="outlined"
                >
                    Upload
                </Button>
            )}
            {!uploading && (
                <Box sx={{ mt: 2 }}>
                    <Button type="button" variant="outlined" onClick={onCancel}>
                        Cancel
                    </Button>
                </Box>
            )}
            {uploading && <CircularProgress />}
        </form>
    );
};

interface Props {
    onCancel: () => void;
    uploading: boolean;
    handlePhotoSubmit: (e: any) => void;
    imageAsUrl: any;
    handleImageAsFile: (e: any) => void;
    ageRange: number[];
    handleAgeRangeChange: (event: any, newValue: any, activeThumb: any) => void;
    showToGender: string;
    handleShowToGenderChange: (event: any) => void;
}
