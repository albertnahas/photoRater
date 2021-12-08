import React, { useEffect, useState } from 'react'
import firebase from "../../config"
import { Container, Box, Stack, Typography, CardContent, Card, CardActionArea, CardMedia, CardActions, Grid, Button, IconButton, Divider, Tooltip } from '@mui/material'
import { useSelector } from 'react-redux'
import { styled } from '@mui/system';
import { ProgressRing } from '../../atoms/ProgressRing/ProgressRing';
import { AccountProfileDetails } from './ProfileDetails';
import { ProfileInfo } from './ProfileInfo';
import { SelectGender } from '../../atoms/SelectGender/SelectGender';

const ProfilePhoto = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    borderRadius: '50%',
    width: 90,
    height: 90,
    top: 15,
    overflow: 'hidden',
    textAlign: 'center',
    '& > img': {
        minWidth: '100%',
        minHeight: '100%',
    },
}));

export const Profile = () => {
    const user = useSelector((state: any) => state.user.value)

    const [editMode, setEditMode] = useState(false)

    return (<Container maxWidth="lg">
        <Grid sx={{ mt: 2, mb: 4 }} spacing={2} container>
            <Grid xs={12} item>
                <Box>
                    <Box sx={{ position: 'relative', margin: 'auto', boxSizing: 'border-box' }}>
                        <ProfilePhoto>
                            <img src={user.photoURL} />
                        </ProfilePhoto>
                        <ProgressRing value={user.points} />
                        <Typography variant="h5" color="text.secondary">{user.displayName}</Typography>
                        <Tooltip title="You will get 1 extra token for each 5 votes you give">
                            <Typography variant="body2" component="div" color="text.secondary">
                                {`${Math.floor(user.points / 10)} rating tokens`}
                            </Typography>
                        </Tooltip>
                    </Box>
                </Box>
                <Divider sx={{ mt: 2, mb: 2 }} variant="middle" />

            </Grid>
            <Grid md={8} xs={12} item>
                <AccountProfileDetails editMode={editMode} setEditMode={setEditMode} user={user} />
            </Grid>
            <Grid md={4} xs={12} item>
                <ProfileInfo />
            </Grid>

        </Grid>
    </Container>
    )
}
