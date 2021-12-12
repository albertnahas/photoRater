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
    IconButton
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React, { FC } from 'react';
import RateProgressBar from '../../atoms/RateProgressBar/RateProgressBar';
import SwitchToggle from '../../atoms/SwitchToggle/SwitchToggle';
import { userPlaceholderPhoto } from '../../utils/constants';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteCircleIcon from '@mui/icons-material/DeleteRounded';
import { Photo } from '../../types/photo';

export const PhotoCard: FC<Props> = ({
    photo,
    onClickPhoto,
    view,
    onDeletePhoto,
    handleToggleChange,
    onClickShowForm
}) => {
    const theme = useTheme();

    return (
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
                                        background: theme.palette.primary.main,
                                        fontSize: 11,
                                        borderRadius: 1,
                                        color: 'white',
                                        width: 35,
                                        ml: view !== 'two-col' ? 2 : 0.5,
                                        p: 0.2
                                    }}
                                >
                                    {photo.rate ? `${photo.rate * 2}/10` : '?'}
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
                                      photo.votesCount === 1 ? 'vote' : 'votes'
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
                    <Grid sx={{ justifyContent: 'space-between' }} container>
                        <Tooltip
                            title={photo.active ? 'deactivate' : 'activate'}
                        >
                            <Grid style={{ alignSelf: 'center' }} item>
                                <SwitchToggle
                                    active={photo.active || false}
                                    handleToggleChange={handleToggleChange}
                                />
                            </Grid>
                        </Tooltip>
                        <Tooltip title="Delete photo">
                            <Grid item>
                                <IconButton
                                    aria-label="add"
                                    size="large"
                                    onClick={onDeletePhoto}
                                >
                                    <DeleteCircleIcon />
                                </IconButton>
                            </Grid>
                        </Tooltip>
                    </Grid>
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
    );
};

interface Props {
    photo?: Photo;
    onClickPhoto?: () => void;
    view?: string;
    handleToggleChange?: (checked: boolean) => void;
    onDeletePhoto?: () => void;
    onClickShowForm?: () => void;
}
