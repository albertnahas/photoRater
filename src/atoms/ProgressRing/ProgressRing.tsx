import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { FC } from 'react'

const getColor = (val: number) => {
  if (val <= 10) return 'error.main'
  if (val <= 20) return 'warning.main'
  return 'primary.main'
}

export var ProgressRing: FC<Props> = function (props) {
  const style = {
    position: 'relative',
    display: 'inline-flex',
    '& svg': { strokeLinecap: 'round', color: getColor(props.value || 0) }
  } as const

  return (
    <Box sx={style}>
      <CircularProgress variant="determinate" size={120} {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {props.label && (
          <Typography variant="h6" component="div" color="text.secondary">
            {`${Math.floor((props.value || 0) / 10)}/10`}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

interface Props {
  value?: number
  label?: string
}
