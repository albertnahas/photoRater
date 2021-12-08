import { Container } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export const ControlPage = (props: any) => {
    return (
        <Container sx={{p:6, flexGrow: 1}}>
            {props.children}
        </Container>
    )
}
