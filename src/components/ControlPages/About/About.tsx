import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export var About = function () {
    return (
        <>
            <Typography variant="h2" color="primary">
                About us
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
                <p>
                    Our purpose is to make the love part slightly easier.
                    Combining real user feedback and AI, we will tell you how
                    you can put your best self forward
                </p>
                <p>
                    There&apos;s plenty of literature that suggests people are
                    unable to see their own photos objectively, so our tool was
                    created to fill this need. We&apos;re big believers in the
                    scientific method and applying the necessary distance and
                    detachment in order to accept whether our preconceived
                    notions hold up to scrutiny. We believe that objectivity, as
                    opposed to ego, is where progress originates.
                </p>
                <p>
                    Photoraterapp tests photos, not people. This is an important
                    and largely misunderstood distinction. Unbeknownst to most
                    people, photos don&apos;t show us as we really are — not
                    even in the strictly physical sense. Not only do photos
                    distort physical reality, they are also highly unreliable
                    for depicting a person&apos;s general manner. Different
                    photos tell completely different stories.
                </p>
            </Box>
        </>
    );
};
