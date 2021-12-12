import { Typography, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Logo } from '../../icons/logo';

export const SplashScreen = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Logo
                sx={{
                    width: 120,
                    height: 120,
                    m: 8,
                    ml: 'auto',
                    mr: 'auto'
                }}
            />
            <Typography variant="h3" color="primary">
                Photo Rater
            </Typography>
            <CircularProgress sx={{ display: 'block', m: 'auto', mt: 6 }} />
        </Box>
    );
};
