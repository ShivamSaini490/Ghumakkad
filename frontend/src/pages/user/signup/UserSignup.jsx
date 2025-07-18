// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogContent,
//   Divider,
//   FormControlLabel,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import GoogleIcon from "@mui/icons-material/Google";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import "./UserSignup.css";
// import axios from "../../../services/axios";
// import { toast } from "react-toastify";

// const emailValidationSchema = Yup.object({
//   input: Yup.string()
//     .required("Email is required")
//     .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
// });

// const profileValidationSchema = Yup.object({
//   firstName: Yup.string().required("Required"),
//   lastName: Yup.string().required("Required"),
//   mobile: Yup.string()
//     .required("Required")
//     .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
//   gender: Yup.string().required("Required"),
//   dob: Yup.date().required("Required"),
//   agree: Yup.boolean().oneOf([true], "You must accept the terms"),
// });

// const UserSignup = () => {
//   const [step, setStep] = useState("email"); // email → profile → success
//   const [otpOpen, setOtpOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(59);
//   const [isResendEnabled, setIsResendEnabled] = useState(false);

//   useEffect(() => {
//     let interval;
//     if (otpOpen) {
//       setTimer(59);
//       setIsResendEnabled(false);
//       interval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev === 1) {
//             clearInterval(interval);
//             setIsResendEnabled(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [otpOpen]);

//   const handleResend = async () => {
//     try {
//       await axios.post("/auth/request-otp", { email: userEmail });
//       setOtp(["", "", "", "", "", ""]);
//       setTimer(59);
//       setIsResendEnabled(false);
//       toast.success("OTP resent successfully");
//     } catch {
//       toast.error("Failed to resend OTP");
//     }
//   };

//   const handleOtpChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && index < 5) {
//       const nextInput = document.getElementById(`otp-${index + 1}`);
//       if (nextInput) nextInput.focus();
//     }
//   };

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       const prevInput = document.getElementById(`otp-${index - 1}`);
//       if (prevInput) prevInput.focus();
//     }
//   };

//   const handleCloseOtp = () => {
//     setOtp(["", "", "", "", "", ""]);
//     setOtpOpen(false);
//   };

//   const handleEmailSubmit = async (values) => {
//     try {
//       await axios.post("/auth/request-otp", { email: values.input });
//       setUserEmail(values.input);
//       setOtpOpen(true);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   const handleOtpSubmit = async () => {
//     try {
//       const code = otp.join("");
//       await axios.post("/auth/verify-otp", { email: userEmail, code });
//       toast.success("OTP verified successfully");
//       setOtpOpen(false);
//       setStep("profile");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Invalid OTP");
//     }
//   };

//   const handleProfileSubmit = async (values, { setSubmitting }) => {
//     try {
//       await axios.post("/auth/signup-complete", { email: userEmail, ...values });
//       toast.success("🎉 Account created successfully!");
//       setStep("success");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Box className="signup-container">
//       <Box className="signup-header">
//         <Typography variant="h5" className="signup-title">
//           Welcome To Ghumakkad User Sign Up
//         </Typography>
//       </Box>

//       {step === "email" && (
//         <Box className="signup-form-box">
//           <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//             Sign up with your email address
//           </Typography>
//           <Formik
//             initialValues={{ input: "" }}
//             validationSchema={emailValidationSchema}
//             onSubmit={handleEmailSubmit}
//           >
//             {({ values, handleChange, handleSubmit, touched, errors }) => (
//               <form onSubmit={handleSubmit}>
//                 <TextField
//                   fullWidth
//                   label="Enter Your Email Address"
//                   name="input"
//                   value={values.input}
//                   onChange={handleChange}
//                   error={touched.input && Boolean(errors.input)}
//                   helperText={touched.input && errors.input}
//                   sx={{ mb: 2 }}
//                 />
//                 <Button type="submit" fullWidth variant="contained" className="signup-button">
//                   Continue
//                 </Button>
//               </form>
//             )}
//           </Formik>

//           <Divider sx={{ my: 2 }}>Or</Divider>

//           <Button fullWidth variant="contained" startIcon={<GoogleIcon />} className="signup-social">
//             Continue With Google
//           </Button>

//           <Typography variant="body2" sx={{ mt: 3, textAlign: "justify" }}>
//             By proceeding, you consent to receive emails from Ghumakkad and its partners at the provided email address.
//           </Typography>
//         </Box>
//       )}

//       {step === "profile" && (
//         <Box className="signup-form-box">
//           <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//             Complete Your Profile
//           </Typography>
//           <Formik
//             initialValues={{
//               firstName: "",
//               lastName: "",
//               mobile: "",
//               gender: "",
//               dob: "",
//               agree: false,
//             }}
//             validationSchema={profileValidationSchema}
//             onSubmit={handleProfileSubmit}
//           >
//             {({ values, handleChange, errors, touched }) => (
//               <Form>
//                 <Stack spacing={2}>
//                   <TextField name="firstName" label="First Name" fullWidth {...commonTextFieldProps(values, handleChange, errors, touched, "firstName")} />
//                   <TextField name="lastName" label="Last Name" fullWidth {...commonTextFieldProps(values, handleChange, errors, touched, "lastName")} />
//                   <TextField name="mobile" label="Mobile Number" fullWidth {...commonTextFieldProps(values, handleChange, errors, touched, "mobile")} />
//                   <TextField
//                     name="gender"
//                     label="Gender"
//                     select
//                     fullWidth
//                     value={values.gender}
//                     onChange={handleChange}
//                     error={touched.gender && Boolean(errors.gender)}
//                     helperText={touched.gender && errors.gender}
//                   >
//                     <MenuItem value="Male">Male</MenuItem>
//                     <MenuItem value="Female">Female</MenuItem>
//                     <MenuItem value="Other">Other</MenuItem>
//                   </TextField>
//                   <TextField
//                     name="dob"
//                     label="Date of Birth"
//                     type="date"
//                     InputLabelProps={{ shrink: true }}
//                     fullWidth
//                     value={values.dob}
//                     onChange={handleChange}
//                     error={touched.dob && Boolean(errors.dob)}
//                     helperText={touched.dob && errors.dob}
//                   />
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         name="agree"
//                         checked={values.agree}
//                         onChange={handleChange}
//                         color="primary"
//                       />
//                     }
//                     label={
//                       <Typography variant="body2">
//                         Accept Ghumakkad's <a href="#" style={{ color: "#1976d2" }}>Terms</a> & <a href="#" style={{ color: "#1976d2" }}>Privacy Policy</a>. By clicking submit, you confirm you are 18+.
//                       </Typography>
//                     }
//                   />
//                   {touched.agree && Boolean(errors.agree) && (
//                     <Typography variant="caption" color="error">
//                       {errors.agree}
//                     </Typography>
//                   )}
//                   <Button type="submit" variant="contained" className="signup-button">
//                     Submit
//                   </Button>
//                 </Stack>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       )}

//       {step === "success" && (
//         <Typography variant="h6" sx={{ mt: 5, textAlign: "center", color: "green" }}>
//           ✅ Signup completed successfully. 🎉 Welcome to Dashboard !
//         </Typography>
//       )}

//       {/* OTP Dialog */}
//       <Dialog open={otpOpen} onClose={(event, reason) => reason !== "backdropClick" && handleCloseOtp()}>
//         <DialogContent className="otp-dialog">
//           <Typography variant="h6" fontWeight="bold" gutterBottom>
//             Enter the 6-digit code sent to:
//           </Typography>
//           <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
//             {userEmail}
//           </Typography>

//           <Box className="otp-input-container">
//             {otp.map((digit, i) => (
//               <input
//                 key={i}
//                 id={`otp-${i}`}
//                 className="otp-input"
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleOtpChange(i, e.target.value)}
//                 onKeyDown={(e) => handleOtpKeyDown(i, e)}
//               />
//             ))}
//           </Box>

//           <Typography variant="body2" sx={{ mt: 1 }}>
//             Tip: Check your inbox or spam folder for the code.
//           </Typography>

//           <Box className="otp-actions">
//             <Box className="otp-resend-box">
//               <Typography variant="body2" color="textSecondary">
//                 {isResendEnabled
//                   ? "You can now resend the code"
//                   : `Resend in 00:${timer < 10 ? `0${timer}` : timer}`}
//               </Typography>
//               <Button
//                 variant="contained"
//                 className="signup-button"
//                 disabled={!isResendEnabled}
//                 onClick={handleResend}
//               >
//                 Resend
//               </Button>
//             </Box>

//             <Box className="otp-next-box">
//               <IconButton onClick={handleCloseOtp}>
//                 <ArrowBackIcon />
//               </IconButton>
//               <Button
//                 variant="contained"
//                 endIcon={<ArrowForwardIcon />}
//                 onClick={handleOtpSubmit}
//                 className="signup-button"
//                 disabled={otp.join("").length !== 6}
//               >
//                 Next
//               </Button>
//             </Box>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// const commonTextFieldProps = (values, handleChange, errors, touched, name) => ({
//   value: values[name],
//   onChange: handleChange,
//   error: touched[name] && Boolean(errors[name]),
//   helperText: touched[name] && errors[name],
// });

// export default UserSignup;







import React, { useState, useEffect } from 'react';
import './UserSignup.css';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Formik } from 'formik';
import {
  userLoginSignupSchema,
  otpValidationSchema,
  userProfileSchema,
} from '../../../validations/userValidation';

import { requestSignupOtp, verifyOtp, completeSignup } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { startOtpTimer, formatTime } from '../../../utils/otpTimer';

const UserSignup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = profile
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (step === 2) {
      if (timerId) clearInterval(timerId);
      setIsResendEnabled(false);
      setTimer(60);
      const id = startOtpTimer(setTimer, 60);
      setTimerId(id);
      return () => clearInterval(id);
    }
  }, [step]);

  const handleIdentifierSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Sending OTP to:', values);
      
      await requestSignupOtp(values.identifier, 'signup');
      toast.success('OTP sent successfully');
      setIdentifier(values.identifier);
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestSignupOtp(identifier, 'signup');
      toast.success('OTP resent');
      setOtp(['', '', '', '', '', '']);
      setIsResendEnabled(false);
      if (timerId) clearInterval(timerId);
      const id = startOtpTimer(setTimer, 60);
      setTimerId(id);
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join('');
    try {
      await verifyOtp(identifier, code);
      toast.success('OTP Verified');
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    }
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      await completeSignup({ ...values, email: identifier });
      toast.success('Signup complete! 🎉');
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="user-signup-main-box">
      <Box className="user-signup-box">
        <Typography variant="h5" className="user-signup-title">
          Welcome To Ghumakkad User Signup
        </Typography>
      </Box>

      {/* Step 1: Email input */}
      {step === 1 && (
        <Box className="user-signup-form">
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            What’s your email address to sign up?
          </Typography>

          <Formik
            initialValues={{ identifier: '' }}
            validationSchema={userLoginSignupSchema}
            onSubmit={handleIdentifierSubmit}
          >
            {({ values, handleChange, handleSubmit, touched, errors, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="identifier"
                  label="Enter your email"
                  value={values.identifier}
                  onChange={handleChange}
                  error={touched.identifier && Boolean(errors.identifier)}
                  helperText={touched.identifier && errors.identifier}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  className="user-signup-button"
                >
                  Continue
                </Button>
              </form>
            )}
          </Formik>

          <Divider sx={{ my: 2 }}>Or</Divider>

          <Stack spacing={1.5}>
            <Button variant="contained" fullWidth className="user-signup-social-button">
              Continue with Google
            </Button>
          </Stack>

          <Typography variant="body2" sx={{ mt: 3, mb: 3, textAlign: 'justify' }}>
            By proceeding, you consent to receive emails from Ghumakkad and its partners
            at the provided email address.
          </Typography>
        </Box>
      )}

      {/* Step 2: OTP Modal */}
      <Dialog
        open={step === 2}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') setStep(1);
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Enter the 6‑digit code sent to</DialogTitle>
        <DialogContent className="otp-dialog">
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: 'center' }}>
            {identifier}
          </Typography>

          <Box className="otp-input-container">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                className="otp-input"
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
              />
            ))}
          </Box>

          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Tip: check your inbox or spam folder for the code.
          </Typography>

          <Box className="otp-actions">
            <Box className="otp-resend-box">
              <Typography variant="body2" color="textSecondary">
                {isResendEnabled
                  ? 'You can now resend the code'
                  : `Resend in ${formatTime(timer)}`}
              </Typography>
              <Button
                variant="contained"
                disabled={!isResendEnabled}
                onClick={handleResend}
                className="user-signup-button"
              >
                Resend
              </Button>
            </Box>

            <Box className="otp-next-box">
              <IconButton onClick={() => setStep(1)}>
                <ArrowBackIcon />
              </IconButton>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                disabled={otp.join('').length !== 6}
                onClick={handleOtpSubmit}
                className="user-signup-button"
              >
                Next
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Step 3: Profile Form */}
      {step === 3 && (
        <Box className="user-signup-form">
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Complete your profile
          </Typography>

          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              mobile: '',
              gender: '',
              dob: '',
            }}
            validationSchema={userProfileSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ values, handleChange, handleSubmit, touched, errors, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  name="mobile"
                  label="Mobile Number"
                  value={values.mobile}
                  onChange={handleChange}
                  error={touched.mobile && Boolean(errors.mobile)}
                  helperText={touched.mobile && errors.mobile}
                  sx={{ mb: 2 }}
                />

                <TextField
                  select
                  fullWidth
                  name="gender"
                  label="Gender"
                  value={values.gender}
                  onChange={handleChange}
                  error={touched.gender && Boolean(errors.gender)}
                  helperText={touched.gender && errors.gender}
                  sx={{ mb: 2 }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </TextField>

                <TextField
                  fullWidth
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={values.dob}  
                  onChange={handleChange}
                  error={touched.dob && Boolean(errors.dob)}
                  helperText={touched.dob && errors.dob}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ mb: 2 }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      name="agree"
                      checked={values.agree}
                      onChange={handleChange}
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="body2">
                      Accept Ghumakkad's <a href="#" style={{ color: '#1976d2' }}>Terms</a> & <a href="#" style={{ color: '#1976d2' }}>Privacy Policy</a>. By clicking submit, you confirm you are 18+.
                    </Typography>
                  </label>
                  {touched.agree && Boolean(errors.agree) && (
                    <Typography variant="caption" color="error">
                      {errors.agree}
                    </Typography>
                  )}
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  className="user-signup-button"
                >
                  Complete Signup
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      )}
    </Box>
  );
};

export default UserSignup;
