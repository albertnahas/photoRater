import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Grid,
    Typography,
    Divider,
    CardActions,
    Tooltip,
    IconButton,
    Fade
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React, { FC } from 'react';
import RateProgressBar, {
    getRatingColor
} from '../../atoms/RateProgressBar/RateProgressBar';
import { userPlaceholderPhoto } from '../../utils/constants';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Photo } from '../../types/photo';
import { PhotoActions } from './PhotoActions';

export const PhotoCard: FC<Props> = ({
    photo,
    photoId,
    onClickPhoto,
    view,
    onClickShowForm
}) => {
    const theme = useTheme();
    const photoRatePercentage = photo?.rate ? photo?.rate * 20 : undefined;
    return (
        <Fade in={true}>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea onClick={onClickPhoto}>
                    <CardMedia
                        component="img"
                        height={view !== 'two-col' ? 300 : 200}
                        image={photo ? photo.imageUrl : userPlaceholderPhoto}
                        alt={photo ? photo.imageName : 'add'}
                    />
                    {photo && (
                        <CardContent>
                            <Grid container>
                                <Grid xs={view !== 'two-col' ? 9 : 8} item>
                                    <RateProgressBar
                                        value={(photo?.rate || 0) * 20}
                                    />
                                </Grid>
                                <Grid xs={view !== 'two-col' ? 3 : 4} item>
                                    <Box
                                        sx={{
                                            background: getRatingColor(
                                                theme,
                                                photoRatePercentage
                                            ),
                                            fontSize: 11,
                                            borderRadius: 1,
                                            color: 'white',
                                            width: 35,
                                            ml: view !== 'two-col' ? 2 : 0.5,
                                            p: 0.2
                                        }}
                                    >
                                        {photo.rate
                                            ? `${photo.rate * 2}/10`
                                            : '?'}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Typography
                                variant="body2"
                                sx={{ mt: 1.5 }}
                                color="text.secondary"
                            >
                                {photo.votesCount
                                    ? `based on ${photo.votesCount} ${
                                          photo.votesCount === 1
                                              ? 'vote'
                                              : 'votes'
                                      }`
                                    : 'no votes yet on this photo'}
                            </Typography>
                        </CardContent>
                    )}
                    <Divider variant="middle" />
                </CardActionArea>
                <CardActions
                    style={{ justifyContent: `${photo ? 'unset' : 'center'}` }}
                >
                    {photo && (
                        <PhotoActions active={photo.active} photoId={photoId} />
                    )}
                    {!photo && (
                        <Tooltip title="Add photo">
                            <IconButton
                                aria-label="delete"
                                size="large"
                                onClick={onClickShowForm}
                            >
                                <AddCircleIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </CardActions>
            </Card>
        </Fade>
    );
};

interface Props {
    photo?: Photo;
    photoId?: string;
    onClickPhoto?: () => void;
    view?: string;
    onClickShowForm?: () => void;
}
