import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Photo } from '../../types/photo';
import { keyframes } from '@emotion/react';
import { getResizedImageUrl } from '../../utils/utils';

const fadeIn = keyframes`
from {
  opacity: 0;
  transform: translateX(25px);
}
to {
  opacity: 1;
  transform: translateX(0);
}
`;
const fadeOut = keyframes`
from {
  opacity: 1;
}
to {
  opacity: 0;
}
`;

export const UserPhoto = ({
    photo,
    animation
}: {
    photo?: Photo;
    animation?: Boolean;
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageLoadingError, setImageLoadingError] = useState(false);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState();

    const handleImageLoaded = () => {
        setImageLoaded(true);
    };
    const handleImageError = (error: any) => {
        setImageLoadingError(true);
    };

    useEffect(() => {
        photo &&
            getResizedImageUrl(photo).then((url) => setCurrentPhotoUrl(url));
    }, [photo?.imageName]);
    return (
        <Paper
            sx={{
                animation: animation ? `${fadeIn} 1s ease` : 'none',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 200,
                width: '100%'
            }}
            variant="outlined"
        >
            <Box
                sx={{
                    animation: imageLoaded ? `${fadeOut} 200ms ease` : 'none',
                    animationFillMode: 'forwards',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    background: '#fefefe'
                }}
            >
                {imageLoadingError ? (
                    <Typography variant="subtitle1" color="error">
                        Image loading error
                    </Typography>
                ) : (
                    <CircularProgress sx={{ color: '#aaa' }} />
                )}
            </Box>
            <img
                style={{
                    width: '100%',
                    marginBottom: -4
                }}
                onLoad={handleImageLoaded}
                onError={handleImageError}
                src={currentPhotoUrl}
                alt={photo?.imageName}
            />
        </Paper>
    );
};
