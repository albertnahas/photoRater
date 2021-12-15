import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    Container,
    Box,
    Stack,
    Typography,
    CardContent,
    Card,
    CardActionArea,
    CardMedia,
    CardActions,
    Grid,
    Button,
    IconButton,
    Divider,
    Tooltip,
    Avatar
} from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/system';
import { PayPalButtons } from '@paypal/react-paypal-js';
import firebase from '../../config';
import { ProgressRing } from '../../atoms/ProgressRing/ProgressRing';
import { AccountProfileDetails } from './ProfileDetails';
import { ProfileInfo } from './ProfileInfo';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { State } from '../../types/state';

const ProfilePhoto = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    borderRadius: '50%',
    width: 90,
    height: 90,
    top: 15,
    overflow: 'hidden',
    textAlign: 'center',
    '& > img': {
        minWidth: '100%',
        minHeight: '100%'
    }
}));

export var Profile = function () {
    const user = useSelector((state: State) => state.user.value);

    const [editMode, setEditMode] = useState(false);
    const PayPalButton = (window as any).paypal?.Buttons.driver('react', {
        React,
        ReactDOM
    });

    const createOrder = (data: any, actions: any) =>
        actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: '0.01'
                    }
                }
            ]
        });

    const onApprove = (data: any, actions: any) => {
        // data.orderID
        const capture = actions.order.capture();
        console.log(capture);
        return capture;
    };

    return (
        <Container maxWidth="lg">
            <Grid sx={{ mt: 2, mb: 4 }} spacing={2} container>
                <Grid xs={12} item>
                    <Box>
                        <Box
                            sx={{
                                position: 'relative',
                                margin: 'auto',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Avatar
                                sx={{
                                    height: 90,
                                    width: 90,
                                    m: 'auto',
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 15
                                }}
                                src={user?.photoURL}
                                alt="profile photo"
                            >
                                <UserCircleIcon fontSize="large" />
                            </Avatar>
                            <ProgressRing value={user?.points} />
                            <Typography variant="h5" color="text.secondary">
                                {user?.displayName}
                            </Typography>
                            <Tooltip title="You will get 1 extra token for each 5 votes you give">
                                <Typography
                                    variant="body2"
                                    component="div"
                                    color="text.secondary"
                                >
                                    {`${Math.floor(
                                        (user?.points || 0) / 10
                                    )} rating tokens`}
                                </Typography>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} variant="middle" />
                </Grid>
                <Grid md={8} xs={12} item>
                    <AccountProfileDetails
                        editMode={editMode}
                        setEditMode={setEditMode}
                        user={user}
                    />
                </Grid>
                <Grid md={4} xs={12} item>
                    <ProfileInfo />
                </Grid>
                {/* <PayPalButtons
                createOrder={(data: any, actions: any) => createOrder(data, actions)}
                onApprove={(data: any, actions: any) => onApprove(data, actions)}
                style={{ layout: "horizontal" }}
            /> */}
            </Grid>
        </Container>
    );
};
