import { Chip, Divider, Grid, Paper, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import RateProgressBar from '../../atoms/RateProgressBar/RateProgressBar'
import firebase from "../../config"

export const PhotoDetails = (props: any) => {

    const [votes, setVotes] = useState<any[]>([])
    const [photo, setPhoto] = useState<any>()

    const user = useSelector((state: any) => state.user.value)
    const theme = useTheme()

    const score = useMemo(() => {
        const votesTotal = votes.reduce((vote, acc) => {
            return parseInt(acc) + parseInt(vote)
        }, 0)

        const avg = votesTotal / votes.length;
        return avg
    }, [votes])

    const chips = useMemo(() => {
        if (votes.length === 0) return []
        const chips = votes.flatMap((v) => v.chips)
        const uniqueChips = [...new Set(chips)];
        const weightedChips = []
        for (const chip of uniqueChips) {
            weightedChips.push({
                chip,
                count: chips.filter((c) => c === chip).length
            })
        }
        return weightedChips.sort((a, b) => (a.count > b.count) ? 1 : -1)
    }, [votes])

    const comments = useMemo(() => {
        const cmnts = votes.flatMap((v) => v.comment)
        const uniqueComments = [...new Set(cmnts)];
        return uniqueComments
    }, [votes])

    useEffect(() => {
        if (!user || !props.photoId) {
            return
        }
        const votesUnsubscribe = firebase.firestore().collection(`users/${user.uid}/photos/${props.photoId}/votes`)
            .onSnapshot(function (querySnapshot: any) {
                const usersVotes: any[] = []
                querySnapshot.forEach((doc: any) => {
                    usersVotes.push(doc.data())
                });
                setVotes(usersVotes)
            });
        return () => {
            votesUnsubscribe()
        }
    }, [user])

    useEffect(() => {
        if (!user || !props.photoId) {
            return
        }
        const photoUnsubscribe = firebase.firestore().collection(`users/${user.uid}/photos/`).doc(props.photoId)
            .onSnapshot(function (querySnapshot: any) {
                setPhoto({ ...querySnapshot.data() })
            });
        return () => {
            photoUnsubscribe()
        }
    }, [user])

    return (
        <Grid container>
            <Grid md={4} sx={{ p: 2 }} item>
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }} >
                    <img style={{ width: '100%', marginBottom: -4 }} src={photo?.imageUrl} />
                </Paper>
                <Grid container>
                    <Grid xs={12} item>
                        <RateProgressBar value={photo?.rate * 20} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid md={8} sx={{ pl: 2 }} item>
                <Typography sx={{ mb: 1 }} variant="h6" color={theme.palette.primary.main}>{`Score: ${photo?.rate * 2}/10`} </Typography>

                {chips.length &&
                    <>
                        <Typography variant="body2" color={theme.palette.primary.main}>Impressions: </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            {chips.map(c => { return c.chip ? <Chip sx={{ m: 0.5 }} key={c.chip} label={`${c.chip} (${c.count})`} /> : <span /> })}
                        </Box>
                        <Divider sx={{ m: 1 }} variant="middle" />
                    </>
                }

                {comments.length &&
                    <Box>
                        <Typography variant="body2" color={theme.palette.primary.main}>Comments: </Typography>
                        <Box sx={{ mt: 1 }}>
                            {comments.map(c => {
                                return <Typography variant="body2" color={theme.palette.text.secondary} key={c}> {c} </Typography>
                            })}
                        </Box>
                    </Box>
                }

                {photo?.ageRange
                    && photo?.ageRange.length === 2
                    && <Typography sx={{ mt: 2, fontSize: 12 }} variant="body2" color={theme.palette.text.secondary}>Voters age range: {photo?.ageRange[0]} - {photo?.ageRange[1]} </Typography>}
                {photo?.updatedAt && <Typography sx={{ mt: 1, fontSize: 12 }} variant="body2" color={theme.palette.text.secondary}>Last update: {photo?.updatedAt.toDate().toLocaleString()} </Typography>}

            </Grid>
        </Grid>
    )
}
