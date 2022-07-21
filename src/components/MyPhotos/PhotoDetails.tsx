import {
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material'
import { Box, useTheme } from '@mui/system'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import RateProgressBar from '../../atoms/RateProgressBar/RateProgressBar'
import firebase from '../../config'
import { State } from '../../types/state'
import { UserPhoto } from '../RatingTab/UserPhoto'
import _ from 'lodash'

export var PhotoDetails: FC<Props> = function (props) {
  const [votes, setVotes] = useState<any[]>([])
  const [photo, setPhoto] = useState<any>()
  const [sortedRates, setSortedRates] = useState<Array<number>>([])
  const [topPercentile, setTopPercentile] = useState<number>(0)

  const user = useSelector((state: State) => state.user.value)
  const theme = useTheme()

  const score = useMemo(() => {
    const votesTotal = votes.reduce(
      (vote, acc) => parseInt(acc) + parseInt(vote),
      0
    )

    const avg = votesTotal / votes.length
    return avg
  }, [votes])

  let photosQuery = firebase.firestore().collection('stats').doc('stats')

  photosQuery
    .get()
    .then((sortedRatesDoc: any) => {
      setSortedRates(sortedRatesDoc.data().sortedRates)
    })
    .catch((err: any) => {
      console.log('error', err)
    })

  const getPercentile = (array: Array<number>, value: number) => {
    const originalLength = array.length
    const a = [...array]
    let alen: Array<number>
    const equalsValue = (v: number) => v === value

    if (!array.some(equalsValue)) {
      a.push(value)
      alen = _.range(a.length)
    } else {
      alen = _.range(a.length + 1)
    }
    const idx = array.map(equalsValue)
    const alenTrue = alen.filter((v: number) => idx[alen.indexOf(v)])
    const meanVal = _.mean(alenTrue)
    const percent = meanVal / originalLength
    return Math.round(percent * 100)
  }

  useEffect(() => {
    setTopPercentile(getPercentile(sortedRates, photo?.rate))
  }, [sortedRates, photo])

  // const overview: any[] = [];
  const overview = useMemo(() => {
    return votes.reduce((acc, val) => {
      const segment = Math.round(val.rate)
      acc[segment] = acc[segment] ? acc[segment] + 1 : 1
      return acc
    }, {})
  }, [votes])

  const chips = useMemo(() => {
    if (votes.length === 0) return []
    const chips = votes.flatMap((v) => v.chips)
    const uniqueChips = [...new Set(chips)]
    const weightedChips = []
    for (const chip of uniqueChips) {
      weightedChips.push({
        chip,
        count: chips.filter((c) => c === chip).length
      })
    }
    return weightedChips.sort((a, b) => (a.count < b.count ? 1 : -1))
  }, [votes])

  const comments = useMemo(() => {
    const cmnts = votes
      .filter((v) => v.comment && v.comment != '')
      .flatMap((v) => ({
        comment: v.comment,
        date: v.ratedAt
      }))
    return cmnts
  }, [votes])

  useEffect(() => {
    if (!user || !props.photoId) {
      return
    }
    const votesUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos/${props.photoId}/votes`)
      .onSnapshot((querySnapshot: any) => {
        const usersVotes: any[] = []
        querySnapshot.forEach((doc: any) => {
          usersVotes.push(doc.data())
        })
        setVotes(usersVotes)
      })
    return () => {
      votesUnsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (!user || !props.photoId) {
      return
    }
    const photoUnsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/photos/`)
      .doc(props.photoId)
      .onSnapshot((querySnapshot: any) => {
        setPhoto({ ...querySnapshot.data() })
      })
    return () => {
      photoUnsubscribe()
    }
  }, [user])

  const displayOverview = () => (
    <List dense>
      {Object.entries(overview).map((c: any[]) => (
        <React.Fragment key={c[0]}>
          <Tooltip
            title={`${c[1]} ${c[1] === 1 ? 'user' : 'users'} out of ${
              votes.length
            } rated this photo as ${c[0] * 2 - 1} or ${c[0] * 2}`}
          >
            <ListItem>
              <ListItemIcon sx={{ mr: 1 }}>
                {`${c[0] * 2 - 1}-${c[0] * 2} (${c[1]})`}
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    <RateProgressBar
                      value={(c[1] * 100) / (votes?.length || 0)}
                    />
                  </>
                }
                color={theme.palette.text.secondary}
              />
            </ListItem>
          </Tooltip>
        </React.Fragment>
      ))}
    </List>
  )

  const displayComments = () => (
    <List dense>
      {comments.map((c) => (
        <React.Fragment key={c.comment}>
          <ListItem>
            <ListItemIcon>
              <ChatBubbleOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={c.comment}
              secondary={
                <Typography
                  sx={{
                    fontSize: 11
                  }}
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {c && c.date && c.date?.toDate().toLocaleString()}
                </Typography>
              }
              color={theme.palette.text.secondary}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  )

  const displayImpressions = () =>
    chips.map((c) =>
      c.chip ? (
        <Chip sx={{ m: 0.5 }} key={c.chip} label={`${c.chip} (${c.count})`} />
      ) : (
        <span />
      )
    )

  return (
    <Container>
      <Grid sx={{ pt: 2 }} container>
        <Grid md={4} xs={12} sx={{ pl: { xs: 0, md: 1 } }} item>
          <Box sx={{ width: '100%', minWidth: 100 }}>
            <UserPhoto photo={photo} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <RateProgressBar value={(photo?.rate || 0) * 20} />
          </Box>
        </Grid>
        <Grid md={8} xs={12} sx={{ pl: { xs: 0, md: 2 } }} item>
          {photo?.rate ? (
            <Typography
              sx={{ mb: 1, mt: { xs: 1, md: 0 } }}
              variant="h6"
              color={theme.palette.primary.main}
            >
              {`Score: ${(photo?.rate || 0) * 2}/10`}{' '}
            </Typography>
          ) : (
            <Typography
              sx={{ mb: 1 }}
              variant="h6"
              color={theme.palette.primary.main}
            >
              No votes yet{' '}
            </Typography>
          )}

          {chips.length > 0 && (
            <>
              <Typography variant="body2" color={theme.palette.primary.main}>
                Impressions{' '}
              </Typography>
              <Box sx={{ mt: 1, mb: 1 }}>{displayImpressions()}</Box>
              <Divider sx={{ m: 1 }} variant="middle" />
            </>
          )}
          <Grid container>
            {comments.length > 0 && (
              <Grid md={7} xs={12} item>
                <Box>
                  <Typography
                    variant="body2"
                    color={theme.palette.primary.main}
                  >
                    Comments{' '}
                  </Typography>
                  {displayComments()}
                </Box>
              </Grid>
            )}

            {votes.length > 1 && Object.entries(overview).length > 1 && (
              <Grid md={5} xs={12} item>
                <Box>
                  <Typography
                    variant="body2"
                    color={theme.palette.primary.main}
                  >
                    Overview ({votes.length}{' '}
                    {votes.length === 1 ? 'vote' : 'votes'})
                  </Typography>

                  {displayOverview()}
                </Box>
              </Grid>
            )}
          </Grid>
          {sortedRates && photo?.rate && votes.length >= 3 && topPercentile <= 70 && (
            <Typography
              sx={{ mt: 2, fontSize: 14 }}
              variant="body2"
              color={theme.palette.success.light}
            >
              &#127881; Wow! Your photo is in top {topPercentile}%!
            </Typography>
          )}
          {photo?.ageRange && photo?.ageRange.length === 2 && (
            <Typography
              sx={{ mt: 2, fontSize: 12 }}
              variant="body2"
              color={theme.palette.text.secondary}
            >
              Voters age range: {photo?.ageRange[0]} - {photo?.ageRange[1]}{' '}
            </Typography>
          )}
          {photo?.updatedAt && (
            <Typography
              sx={{ mt: 1, fontSize: 12 }}
              variant="body2"
              color={theme.palette.text.secondary}
            >
              Last update: {photo?.updatedAt.toDate().toLocaleString()}{' '}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

interface Props {
  photoId?: string | null
}
