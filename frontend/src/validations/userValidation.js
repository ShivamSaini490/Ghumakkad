import * as Yup from 'yup';

// ✅ Validation for email or mobile input (for login/signup)
export const userLoginSignupSchema = Yup.object({
  identifier: Yup.string()
    .required('Email or mobile number is required')
    .test('is-valid-identifier', 'Must be a valid email or Indian mobile number', function (value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[6-9]\d{9}$/;
      return emailRegex.test(value) || mobileRegex.test(value);
    }),
});

// ✅ Validation for OTP input (4-digit)
export const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

// ✅ Validation for profile completion after signup
export const userProfileSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date().required('Date of birth is required'),
});
