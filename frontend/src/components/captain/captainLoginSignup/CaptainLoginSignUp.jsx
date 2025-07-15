import React from 'react';
import './CaptainLoginSignUp.css';
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';


const CaptainLoginSignUp = () => {
   const validationSchema = Yup.object({
      input: Yup.string()
        .required('Phone number or email is required')
        .matches(
          /^((\+91)?[6-9][0-9]{9}|[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})$/,
          'Enter a valid phone number or email address'
        ),
    });
  return (
    <Box className='captain-login-signup-main-box'>
      <Box className='captain-login-signup-box'>
        <Typography variant='h5' className='captain-login-signup-title'>
          Ghumakkad Captain Login/Sign Up
        </Typography>
      </Box>

      <Box className='captain-login-signup-form'>
        <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }}>
          What's your phone number or email?
        </Typography>

        <Formik
          initialValues={{ input: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            alert(`Login Successful with: ${values.input}`);
          }}
        >
          {({ values, handleChange, handleSubmit, touched, errors }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant='outlined'
                label='Enter your phone number or email'
                name='input'
                value={values.input}
                onChange={handleChange}
                error={touched.input && Boolean(errors.input)}
                helperText={touched.input && errors.input}
                sx={{ mb: 2 }}
              />
                <Button
                type='submit'
                fullWidth
                variant='contained'
                className='captain-login-signup-button'
              >
                Continue
              </Button>
            </form>
          )}
        </Formik>

        <Divider sx={{ my: 2 }}>Or</Divider>

        <Stack spacing={1.5}>
          <Button
            variant='contained'
            fullWidth
            startIcon={<GoogleIcon />}
            className='captain-login-social-media-button'
          >
            Continue With Google
          </Button>
          <Button
            variant='contained'
            fullWidth
            startIcon={<AppleIcon />}
            className='captain-login-social-media-button'
          >
            Continue With Apple
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }}>Or</Divider>

        <Button
          variant='contained'
          fullWidth
          className='captain-login-social-media-button'
        >
          Login With QR Code
        </Button>

        <Typography variant='body2' sx={{ mt: 3 }}>
          By proceeding, you consent to get calls, WhatsApp messages, SMS, and emails from Ghumakkad and its partners at the phone number provided. This includes updates on your trip, offers, and promotions. You can opt-out at any time.
        </Typography>
      </Box>
    </Box>
  )
}

export default CaptainLoginSignUp
