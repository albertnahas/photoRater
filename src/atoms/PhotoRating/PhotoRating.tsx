import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75'
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47'
  }
})

const PhotoRating: React.FC<Props> = (props) => {
  return (
    <Box
      sx={{
        '& > legend': { mt: 2 }
      }}
    >
      <StyledRating
        name="customized-color"
        defaultValue={0}
        value={props.value || 0}
        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
        precision={0.5}
        icon={<FavoriteIcon fontSize="large" />}
        emptyIcon={<FavoriteBorderIcon fontSize="large" />}
        onChange={props.onRatingChange}
      />
    </Box>
  )
}

interface Props {
  value: number
  onRatingChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => void
}

export default PhotoRating
