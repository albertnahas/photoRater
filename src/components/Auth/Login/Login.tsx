import React, { FC, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import { Facebook as FacebookIcon } from '../../../icons/facebook';
import { Google as GoogleIcon } from '../../../icons/google';
import { useSelector } from 'react-redux';
import { State } from '../../../types/state';
import { Navigate } from 'react-router';
import { useAnalytics } from '../../../hooks/useAnalytics';

export var Login: FC<Props> = function (props) {
    const user = useSelector((state: State) => state.user.value);
    const analytics = useAnalytics();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Email is required'),
            password: Yup.string().max(255).required('Password is required')
        }),
        onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
            props
                .onSubmit?.(values.email, values.password)
                .then((res: any) => {
                    if (res.message) {
                        setErrors({
                            email: res.message
                        });
                        setSubmitting(false);
                    }
                })
                .catch((e: any) => {
                    console.log(e);
                });
        }
    });

    return user === null ? (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexGrow: 1,
                minHeight: '100%',
                textAlign: 'center',
                pb: 2
            }}
            aria-label="login container"
        >
            <Container maxWidth="sm">
                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ my: 3 }}>
                        <Typography color="textPrimary" variant="h4">
                            Sign in
                        </Typography>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="body2"
                        >
                            Sign in and get started
                        </Typography>
                        {props.error && (
                            <Typography
                                color="error.main"
                                gutterBottom
                                variant="body2"
                            >
                                {props.error}
                            </Typography>
                        )}
                    </Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Button
                                color="info"
                                fullWidth
                                startIcon={<FacebookIcon />}
                                onClick={props.signInWithFacebook}
                                size="large"
                                variant="contained"
                            >
                                Login with Facebook
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button
                                fullWidth
                                color="error"
                                startIcon={<GoogleIcon />}
                                onClick={props.signInWithGoogle}
                                size="large"
                                variant="contained"
                            >
                                Continue with Google
                            </Button>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            pb: 1,
                            pt: 3
                        }}
                    >
                        <Typography
                            align="center"
                            color="textSecondary"
                            variant="body1"
                        >
                            or login with email address
                        </Typography>
                    </Box>
                    <TextField
                        error={Boolean(
                            formik.touched.email && formik.errors.email
                        )}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email Address"
                        margin="normal"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
                        variant="outlined"
                    />
                    <TextField
                        error={Boolean(
                            formik.touched.password && formik.errors.password
                        )}
                        fullWidth
                        helperText={
                            formik.touched.password && formik.errors.password
                        }
                        label="Password"
                        margin="normal"
                        name="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="password"
                        value={formik.values.password}
                        variant="outlined"
                    />
                    <Box sx={{ py: 2 }}>
                        {!props.loading ? (
                            <Button
                                color="primary"
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Sign In
                            </Button>
                        ) : (
                            <CircularProgress />
                        )}
                    </Box>
                    <Typography color="textSecondary" variant="body2">
                        Don&apos;t have an account?{' '}
                        <Button aria-label="sign up" onClick={props.signUp}>
                            Sign up
                        </Button>
                    </Typography>
                </form>
            </Container>
        </Box>
    ) : (
        <Navigate replace to="/" />
    );
};

interface Props {
    onSubmit?: (email: string, password: string) => Promise<any>;
    signUp: () => void;
    signInWithGoogle?: () => void;
    signInWithFacebook?: () => void;
    error?: string;
    loading?: boolean;
}
