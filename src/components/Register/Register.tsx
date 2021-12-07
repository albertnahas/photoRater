import { Container, Typography, TextField, Checkbox, FormHelperText, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react'
import firebase from '../../config'


export const Register = (props: any) => {

    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            age: '',
            gender: 'male',
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .email(
                    'Must be a valid email')
                .max(255)
                .required(
                    'Email is required'),
            firstName: Yup
                .string()
                .max(255)
                .required(
                    'First name is required'),
            lastName: Yup
                .string()
                .max(255)
                .required(
                    'Last name is required'),
            password: Yup
                .string()
                .max(255)
                .required(
                    'Password is required'),
            age: Yup
                .number()
                .max(90)
                .min(16)
                .required(
                    'Age is required'),
            gender: Yup
                .string()
                .required(
                    'Age is required'),
        }),
        onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
            props.onSubmit(values.email, values.password).then((res: any) => {
                if (res.message) {
                    setErrors({
                        email: res.message
                    })
                    setSubmitting(false)
                }
                else {
                    const newUser = res.user
                    firebase.firestore().collection("users").doc(newUser.uid).set({
                        uid: newUser.uid,
                        displayName: `${values.firstName} ${values.lastName}`,
                        email: values.email,
                        age: values.age,
                        gender: values.gender,
                    });
                }
            }).catch((e: any) => {
                console.log(e)

            })
        }
    });

    return (
        <>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ my: 3 }}>
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                Create a new account
                            </Typography>
                            <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="body2"
                            >
                                Use your email to create a new account
                            </Typography>
                        </Box>
                        <TextField
                            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                            fullWidth
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            label="First Name"
                            margin="dense"
                            name="firstName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                            variant="outlined"
                            
                        />
                        <TextField
                            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                            fullWidth
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            label="Last Name"
                            margin="dense"
                            name="lastName"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                            variant="outlined"
                            

                        />
                        <TextField
                            error={Boolean(formik.touched.email && formik.errors.email)}
                            fullWidth
                            helperText={formik.touched.email && formik.errors.email}
                            label="Email Address"
                            margin="dense"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                            variant="outlined"
                            

                        />
                        <TextField
                            error={Boolean(formik.touched.password && formik.errors.password)}
                            fullWidth
                            helperText={formik.touched.password && formik.errors.password}
                            label="Password"
                            margin="dense"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                            variant="outlined"
                            

                        />
                        <TextField
                            error={Boolean(formik.touched.age && formik.errors.age)}
                            helperText={formik.touched.age && formik.errors.age}
                            fullWidth
                            label="age"
                            margin="dense"
                            name="age"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="number"
                            value={formik.values.age}
                            variant="outlined"
                            

                        />
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup
                                row
                                aria-label="gender"
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}>
                                <FormControlLabel value="female" control={<Radio  />} label="Female" />
                                <FormControlLabel value="male" control={<Radio  />} label="Male" />
                            </RadioGroup>
                        </FormControl>
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Sign Up
                            </Button>
                        </Box>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            Have an account?
                            {' '} <Button onClick={props.login}>Login</Button>
                        </Typography>
                    </form>
                </Container>
            </Box>
        </>
    )
}
