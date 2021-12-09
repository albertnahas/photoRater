import { Chip, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import RateProgressBar from '../../atoms/RateProgressBar/RateProgressBar'
import firebase from "../../config"
import NotesIcon from '@mui/icons-material/Notes';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

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
        const cmnts = votes.filter(v => v.comment && v.comment != '').flatMap((v) => {
            return {
                comment: v.comment,
                date: v.ratedAt
            }
        })
        return cmnts
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
                        <RateProgressBar value={(photo?.rate || 0) * 20} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid md={8} sx={{ pl: 2 }} item>
                {photo?.rate ? <Typography sx={{ mb: 1 }} variant="h6" color={theme.palette.primary.main}>{`Score: ${(photo?.rate || 0) * 2}/10`} </Typography>
                    : <Typography sx={{ mb: 1 }} variant="h6" color={theme.palette.primary.main}>{`No votes yet`} </Typography>}


                {chips.length > 0 &&
                    <>
                        <Typography variant="body2" color={theme.palette.primary.main}>Impressions: </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            {chips.map(c => { return c.chip ? <Chip sx={{ m: 0.5 }} key={c.chip} label={`${c.chip} (${c.count})`} /> : <span /> })}
                        </Box>
                        <Divider sx={{ m: 1 }} variant="middle" />
                    </>
                }

                {comments.length > 0 &&
                    <Box>
                        <Typography variant="body2" color={theme.palette.primary.main}>Comments: </Typography>
                        <List dense={true}>
                            {comments.map(c => {
                                return <React.Fragment key={c.comment}><ListItem>
                                    <ListItemIcon>
                                        <ChatBubbleOutlineIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={c.comment}
                                        secondary={<Typography
                                            sx={{ fontSize: 11 }}
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {c && c.date && c.date?.toDate().toLocaleString()}
                                        </Typography>}
                                        color={theme.palette.text.secondary}
                                    />
                                </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            })}
                        </List>
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
