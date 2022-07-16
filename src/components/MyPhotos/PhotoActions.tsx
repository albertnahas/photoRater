import { Grid, Tooltip, IconButton } from '@mui/material'
import React, { FC } from 'react'
import SwitchToggle from '../../atoms/SwitchToggle/SwitchToggle'
import DeleteCircleIcon from '@mui/icons-material/DeleteRounded'
import useUserPhotos from '../../hooks/useUserPhotos'
import { useSelector } from 'react-redux'
import { State } from '../../types/state'

export const PhotoActions: FC<Props> = ({ photoId, active, condensed }) => {
  const { photoUtils } = useUserPhotos()
  const user = useSelector((state: State) => state.user.value)
  const handleToggleChange = (checked: boolean) => {
    photoUtils.changePhotoStatus(checked, photoId || '')
  }
  const onDeletePhoto = () => {
    photoUtils.deletePhoto(photoId)
  }

  return (
    <Grid
      sx={{
        justifyContent: condensed ? 'flex-end' : 'space-between',
        gap: 2
      }}
      container
    >
      <Tooltip title={active ? 'deactivate' : 'activate'}>
        <Grid style={{ alignSelf: 'center' }} item>
          <SwitchToggle
            active={active || false}
            disabled={(user?.points || 0) <= 0}
            handleToggleChange={handleToggleChange}
          />
        </Grid>
      </Tooltip>
      <Tooltip title="Delete photo">
        <Grid item>
          <IconButton aria-label="add" size="large" onClick={onDeletePhoto}>
            <DeleteCircleIcon />
          </IconButton>
        </Grid>
      </Tooltip>
    </Grid>
  )
}

interface Props {
  photoId?: string
  active?: boolean
  condensed?: boolean
}
