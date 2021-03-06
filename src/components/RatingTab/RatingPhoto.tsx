import React from 'react'
import {
  Container,
  Grid,
  Typography,
  TextField,
  Stack,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  LinearProgress
} from '@mui/material'
import { Box } from '@mui/system'
import { FC, useState } from 'react'
import PhotoRating from '../../atoms/PhotoRating/PhotoRating'
import { Photo } from '../../types/photo'
import { reportReasons, tags } from '../../utils/utils'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import FlagIcon from '@mui/icons-material/Flag'
import ModalDialog from '../../molecules/ModalDialog/ModalDialog'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { UserPhoto } from './UserPhoto'
import { SwipableCard } from './SwipableCard'

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
  onRatingChange,
  flagAsInappropriate,
  commentRef,
  loadingSubmit
}) => {
  const [openReport, setOpenReport] = useState(false)

  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item md={4} xs={12}>
          <SwipableCard
            onSwipe={(rate: number, done?: boolean) =>
              onRatingChange.apply(null, [rate, done])
            }
          >
            <UserPhoto photo={photo} animation={true} />
          </SwipableCard>
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
              sx={{ my: 1.5 }}
              variant="h6"
              color="text.secondary"
              ref={commentRef}
            >
              How attractive you think the person is in this photo?
            </Typography>
            <PhotoRating
              value={currentPhotoRating}
              onRatingChange={(e, newValue) =>
                onRatingChange.apply(null, [newValue, true])
              }
            />
            <TextField
              sx={{
                width: {
                  md: '70%',
                  xs: '100%'
                },
                my: 2
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
                  const active = chips.indexOf(t) !== -1
                  return (
                    <Chip
                      sx={{
                        backgroundColor: `${active ? '#999' : '#eee'}`,
                        color: `${active ? '#fff' : 'inherit'}`
                      }}
                      onClick={() => handleChipClicked(t)}
                      key={t}
                      label={t}
                    />
                  )
                } else {
                  return <></>
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
            {!loadingSubmit ? (
              <>
                <Divider
                  sx={{
                    width: '70%',
                    alignSelf: 'center',
                    my: 1
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
                    submitRating(photo)
                  }}
                >
                  Rate
                </Button>

                <Divider
                  sx={{
                    width: '70%',
                    alignSelf: 'center',
                    my: 1
                  }}
                  variant="middle"
                />

                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  endIcon={<SkipNextIcon />}
                  component="span"
                  onClick={updateCurrentPhoto.bind(null, true)}
                >
                  Skip
                </Button>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  endIcon={<FlagIcon />}
                  component="span"
                  onClick={() => {
                    setOpenReport(true)
                  }}
                >
                  Flag as inappropriate
                </Button>
              </>
            ) : (
              <Box sx={{ width: '70%', mt: 4 }}>
                <LinearProgress />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <ModalDialog
        closeButton={true}
        open={openReport}
        setOpen={setOpenReport}
        actions={
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Button
              variant="text"
              color="secondary"
              size="large"
              component="span"
              onClick={() => setOpenReport(false)}
            >
              Cancel
            </Button>
          </Box>
        }
      >
        <Box>
          <Typography
            color="error.main"
            sx={{ textAlign: 'center', my: 2 }}
            variant="h5"
          >
            Flag as inappropriate
          </Typography>
          <Divider />
          <List>
            {reportReasons.map((r) => (
              <ListItem
                key={r}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="report"
                    onClick={() => {
                      flagAsInappropriate(photo, r)
                      setOpenReport(false)
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  onClick={() => {
                    flagAsInappropriate(photo, r)
                    setOpenReport(false)
                  }}
                >
                  <ListItemText primary={r} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </ModalDialog>
    </Container>
  )
}

interface Props {
  photo?: Photo
  updateCurrentPhoto: () => void
  submitRating: (photo?: Photo) => void
  flagAsInappropriate: (photo?: Photo, reason?: string) => void
  showTags: boolean
  setShowTags: (showTags: any) => void
  handleChipClicked: (tag: string) => void
  chips: string[]
  comment: string
  handleCommentChange: (e: any) => void
  currentPhotoRating: number
  onRatingChange: (newValue: number | null, scrollIntoView?: boolean) => void
  commentRef: any
  loadingSubmit?: boolean
}
