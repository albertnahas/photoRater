import React, { FC } from "react"
import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import { useTheme } from "@mui/system"
import firebase from "../../config"
import { showGenderLabel } from "../../utils/utils"
import { SelectGender } from "../../atoms/SelectGender/SelectGender"
import { User } from "../../types/user"
import { useUser } from "../../hooks/useUser"

export var AccountProfileDetails: FC<Props> = function (props) {
  const [sucess, setSucess] = useState(false)

  const { updateUser } = useUser()

  const theme = useTheme()

  const formik = useFormik({
    initialValues: {
      age: props.user?.age,
      gender: props.user?.gender,
      showGender: props.user?.showGender,
    },
    validationSchema: Yup.object({
      age: Yup.number().max(90).min(16).required("Age is required"),
      gender: Yup.string().required("Gender is required"),
      showGender: Yup.string().required("Show gender is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      updateUser({
        uid: props.user?.uid,
        age: values.age,
        gender: values.gender,
        showGender: values.showGender,
      }).then(() => {
        setSucess(true)
        props.setEditMode(false)
      })
    },
  })

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return
    }
    setSucess(false)
  }

  return props.editMode ? (
    <form onSubmit={formik.handleSubmit}>
      <Card elevation={0}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.age && formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
                fullWidth
                label="age"
                margin="normal"
                name="age"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.age}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio size="small" />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio size="small" />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <SelectGender
                value={formik.values.showGender}
                onChange={formik.handleChange}
                name="showGender"
                label="Show me:"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider variant="middle" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Button color="primary" variant="outlined" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
      <Snackbar open={sucess} autoHideDuration={2000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Profile has been saved!
        </Alert>
      </Snackbar>
    </form>
  ) : (
    <Card elevation={0}>
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "center", alignItems: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" color={theme.palette.text.secondary}>
              {props.user?.age} {props.user?.gender}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              show me {showGenderLabel(props.user?.showGender)}
            </Typography>
          </Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => props.setEditMode(true)}>
              <EditIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  )
}

interface Props {
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  user?: User | null
}
