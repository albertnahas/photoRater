import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, {
    linearProgressClasses
} from '@mui/material/LinearProgress';
import { useTheme } from '@mui/system';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5
        // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    }
}));

export default function RateProgressBar(props: any) {
    const translateX = (props.value || 0) - 100;
    const theme = useTheme();
    return (
        <Box sx={{ flexGrow: 1 }}>
            <BorderLinearProgress
                sx={{
                    [`& .${linearProgressClasses.bar}`]: {
                        background: `linear-gradient(90deg , 
                        ${theme.palette.info.main} 0 70%, 
                        ${theme.palette.primary.light} 90% 100%)`,
                        backgroundPositionX: translateX * -1
                    }
                }}
                variant="determinate"
                value={props.value || 0}
            />
        </Box>
    );
}
