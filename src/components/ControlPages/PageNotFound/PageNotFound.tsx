import React from 'react'
import { Box, Container, Typography } from '@mui/material'

const PageNotFound = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box></Box>
      <Typography
        variant="h1"
        color="primary"
        sx={{ mt: 3, fontSize: '2em', fontWeight: 500 }}
      >
        Oops, the page you are looking for, <br /> does not exist.
      </Typography>
    </Container>
  )
}

export default PageNotFound
