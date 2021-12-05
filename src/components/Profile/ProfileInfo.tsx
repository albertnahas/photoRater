import { Avatar, Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import firebase from "../../config"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export const ProfileInfo = (props: any) => {

    const [votes, setVotes] = useState<any[]>([])

    const user = useSelector((state: any) => state.user.value)
    const theme = useTheme()

    useEffect(() => {
        const photosUnsubscribe = firebase.firestore().collection(`users/${user.uid}/votes`)
            .onSnapshot(function (querySnapshot: any) {
                const userVotes: any[] = []
                querySnapshot.forEach((doc: any) => {
                    userVotes.push(doc)
                });
                setVotes(userVotes)
            });
        return () => {
            photosUnsubscribe()
        }
    }, [user])
    return (
        <>
            <Grid
                container
                spacing={2}
            >
                <Grid
                    item
                    xs={6}
                >
                    <Card
                        sx={{ height: '100%' }}
                        {...props}
                    >
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                                sx={{ justifyContent: 'space-between' }}
                            >
                                <Grid item>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="overline"
                                    >
                                        TOKENS
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="h4"
                                    >
                                        {Math.floor(user.points / 10)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'error.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <FavoriteBorderIcon />
                                    </Avatar>
                                </Grid>
                            </Grid>
                            <Box
                                sx={{
                                    pt: 2,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    How many votes you can still recieve
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={6}
                >
                    <Card
                        sx={{ height: '100%' }}
                        {...props}
                    >
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                                sx={{ justifyContent: 'space-between' }}
                            >
                                <Grid item>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="overline"
                                    >
                                        Rated
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="h4"
                                    >
                                        {votes.length}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar
                                        sx={{
                                            backgroundColor: 'success.main',
                                            height: 56,
                                            width: 56
                                        }}
                                    >
                                        <HowToRegIcon />
                                    </Avatar>
                                </Grid>
                            </Grid>
                            <Box
                                sx={{
                                    pt: 2,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Photos rated
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>

    )
}
