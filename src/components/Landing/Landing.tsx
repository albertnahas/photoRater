import React, { FC } from 'react';
import { useTheme } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { Intro } from '../../icons/intro';

export var Landing: FC<Props> = function (props) {
    const theme = useTheme();

    return (
        <div
            style={{
                background: theme.palette.primary.main,
                flexGrow: 1,
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: 'calc( 100vh - 64px )'
            }}
        >
            <Typography
                sx={{ fontWeight: 'lighter' }}
                variant="h3"
                color="white"
                aria-label="use your best photos"
            >
                Always use your best photos!
            </Typography>
            <Typography sx={{ m: 1 }} variant="body1" color="white">
                Get the opinion of people from all over the world to rate your
                photos
            </Typography>
            <Intro sx={{ mt: 3, width: 280, height: 280 }} />
            <Button
                color="primary"
                fullWidth
                size="large"
                onClick={props.login}
                sx={{
                    border: '2px solid white',
                    width: 200,
                    color: 'white',
                    mt: 3
                }}
                aria-label="get started"
            >
                Get started
            </Button>
        </div>
    );
};

interface Props {
    login: () => void;
}
