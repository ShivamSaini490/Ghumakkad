import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./Profile.css";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  mobile: Yup.string()
    .required("Required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  gender: Yup.string().required("Required"),
  dob: Yup.date().required("Required"),
  agree: Yup.boolean().oneOf([true], "You must accept the terms"),
});

const Profile = () => {
  return (
    <Box className="profile-main-box">
      <Box className="profile-header-box">
        <Typography variant="h5" className="profile-title">
          Continue To Ghumakkad
        </Typography>
      </Box>

      <Box className="profile-content-box">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            mobile: "",
            gender: "",
            dob: "",
            agree: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            alert("Profile submitted successfully!");
            console.log(values);
          }}
        >
          {({ values, handleChange, errors, touched }) => (
            <Form>
              <Box sx={{ px: { xs: 1, sm: 2 } }}>
                <Stack spacing={2}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    fullWidth
                  />
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    fullWidth
                  />
                  <TextField
                    name="mobile"
                    label="Mobile No."
                    value={values.mobile}
                    onChange={handleChange}
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                    fullWidth
                  />
                  <TextField
                    name="gender"
                    label="Gender"
                    select
                    value={values.gender}
                    onChange={handleChange}
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={touched.gender && errors.gender}
                    fullWidth
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                  <TextField
                    name="dob"
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={values.dob}
                    onChange={handleChange}
                    error={touched.dob && Boolean(errors.dob)}
                    helperText={touched.dob && errors.dob}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agree"
                        checked={values.agree}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Accept Ghumakkad's{" "}
                        <a href="#" style={{ color: "#1976d2" }}>
                          Terms
                        </a>{" "}
                        &{" "}
                        <a href="#" style={{ color: "#1976d2" }}>
                          Review Privacy Notice
                        </a>
                        .<br />
                        By selecting "I Agree" below, I have reviewed and agree to
                        the Terms of Use and acknowledge the Privacy Notice. I am
                        at least 18 years of age.
                      </Typography>
                    }
                  />
                  {touched.agree && Boolean(errors.agree) && (
                    <Typography variant="caption" color="error">
                      {errors.agree}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    type="submit"
                    className="profile-button"
                  >
                    Submit
                  </Button>
                </Stack>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Profile;
