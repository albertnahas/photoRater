import React, { FC, useEffect, useState } from 'react';
import { Button, Typography, Stack, useTheme } from '@mui/material';
import { Step1Icon } from '../../icons/onBoarding/Step1Icon';
import { Step4Icon } from '../../icons/onBoarding/Step4Icon';
import { Step3Icon } from '../../icons/onBoarding/Step3Icon';
import { Step2Icon } from '../../icons/onBoarding/Step2Icon';

export var OnBoarding: FC<Props> = function (props) {
    const [step, setStep] = useState(1);
    const iconStyle: any = { height: 60, width: 60 };
    const theme = useTheme();

    useEffect(() => {
        if (step === 5 && props.done) {
            props.done();
        }
        return () => {};
    }, [step]);

    return (
        <Stack
            spacing={4}
            sx={{ p: 2, textAlign: 'center', alignItems: 'center' }}
        >
            {step === 1 && (
                <>
                    <Step1Icon sx={iconStyle} />
                    <Typography variant="h5" color={theme.palette.primary.main}>
                        Upload your photos
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                    >
                        Start uploading your best photos to the app, in order to
                        get the honest feedback about them, don&apos;t hesitate
                        to experiment with many photos
                    </Typography>
                </>
            )}
            {step === 2 && (
                <>
                    <Step2Icon sx={iconStyle} />
                    <Typography variant="h5" color={theme.palette.primary.main}>
                        Activate your photo
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                    >
                        Activate the photos that you need feedback for at the
                        moment, using the switch at the bottom left of each
                        photo in My Photos tab, people can&apos;t see your
                        photos when they are disabled
                    </Typography>
                </>
            )}
            {step === 3 && (
                <>
                    <Step3Icon sx={iconStyle} />
                    <Typography variant="h5" color={theme.palette.primary.main}>
                        Rate photos of others
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                    >
                        Explore rating tab where you can rate other people
                        photos, You will get one token for every five rates you
                        give, every token allows you to recieve one vote, you
                        start with two free tokens
                    </Typography>
                </>
            )}
            {step === 4 && (
                <>
                    <Step4Icon sx={iconStyle} />
                    <Typography variant="h5" color={theme.palette.primary.main}>
                        Watch your insights
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                    >
                        Watch the feedback given by people instantly, click each
                        photo to get detailed overview, including people
                        comments and impressions
                    </Typography>
                </>
            )}
            <Button
                color="primary"
                size="large"
                variant="text"
                onClick={() => setStep((s) => s + 1)}
            >
                {step < 4 ? 'Next' : 'Done'}
            </Button>
        </Stack>
    );
};

interface Props {
    done: () => void;
}
