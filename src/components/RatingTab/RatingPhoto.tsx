import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Stack,
    Chip,
    Button,
    Divider
} from '@mui/material';
import { Box } from '@mui/system';
import React, { FC } from 'react';
import PhotoRating from '../../atoms/PhotoRating/PhotoRating';
import { Photo } from '../../types/photo';
import { tags } from '../../utils/utils';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export const RatingPhoto: FC<Props> = ({
    photo,
    updateCurrentPhoto,
    submitRating,
    showTags,
    setShowTags,
    handleChipClicked,
    chips,
    comment,
    handleCommentChange,
    currentPhotoRating,
    onRatingChange
}) => {
    return (
        <Container maxWidth="lg">
            <Grid container>
                <Grid item md={4}>
                    <Paper elevation={3}>
                        <img
                            style={{ width: '100%', marginBottom: -4 }}
                            src={photo?.imageUrl}
                            alt={photo?.imageName}
                        />
                    </Paper>
                </Grid>

                <Grid item md={8}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            sx={{ m: 2 }}
                            variant="h6"
                            color="text.secondary"
                        >
                            How attractive you think the person is in this
                            photo?
                        </Typography>
                        <PhotoRating
                            value={currentPhotoRating}
                            onRatingChange={onRatingChange}
                        />
                        <TextField
                            sx={{
                                width: {
                                    md: '70%',
                                    xs: '100%'
                                },
                                m: 4
                            }}
                            id="outlined-basic"
                            label="Comment"
                            variant="outlined"
                            onChange={handleCommentChange}
                            value={comment}
                        />
                        <Stack
                            direction="row"
                            sx={{
                                width: {
                                    md: '70%',
                                    xs: '100%'
                                },
                                flexWrap: 'wrap',
                                gap: '6px'
                            }}
                            spacing={0}
                        >
                            {tags.map((t: string, i: number) => {
                                if (i < 15 || showTags) {
                                    const active = chips.indexOf(t) !== -1;
                                    return (
                                        <Chip
                                            sx={{
                                                backgroundColor: `${
                                                    active ? '#999' : '#eee'
                                                }`,
                                                color: `${
                                                    active ? '#fff' : 'inherit'
                                                }`
                                            }}
                                            onClick={() => handleChipClicked(t)}
                                            key={t}
                                            label={t}
                                        />
                                    );
                                }
                            })}
                            <Button
                                style={{ textTransform: 'none' }}
                                variant="text"
                                color="secondary"
                                component="span"
                                onClick={() => setShowTags((f: boolean) => !f)}
                            >
                                {showTags ? 'hide' : 'show more'}
                            </Button>
                        </Stack>
                        <Divider
                            style={{
                                width: '70%',
                                alignSelf: 'center',
                                margin: 16
                            }}
                            variant="middle"
                        />

                        <Button
                            aria-label="add"
                            color="primary"
                            variant="text"
                            size="large"
                            endIcon={<SendRoundedIcon />}
                            onClick={() => {
                                submitRating(photo);
                            }}
                        >
                            Rate
                        </Button>
                        <Divider
                            style={{
                                width: '70%',
                                alignSelf: 'center',
                                margin: 16
                            }}
                            variant="middle"
                        />

                        <Button
                            variant="text"
                            color="secondary"
                            size="small"
                            endIcon={<SkipNextIcon />}
                            component="span"
                            onClick={updateCurrentPhoto}
                        >
                            Skip
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

interface Props {
    photo?: Photo;
    updateCurrentPhoto: () => void;
    submitRating: (photo?: Photo) => void;
    showTags: boolean;
    setShowTags: (showTags: any) => void;
    handleChipClicked: (tag: string) => void;
    chips: string[];
    comment: string;
    handleCommentChange: (e: any) => void;
    currentPhotoRating: number;
    onRatingChange: (e: any, newValue: number | null) => void;
}