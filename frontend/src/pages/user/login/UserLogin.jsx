// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./UserLogin.css";
// import axios from "../../../services/axios";
// import {
//   Box,
//   Button,
//   Divider,
//   Stack,
//   TextField,
//   Typography,
//   Dialog,
//   DialogContent,
//   IconButton,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import GoogleIcon from "@mui/icons-material/Google";
// import { toast } from "react-toastify";

// const UserLogin = () => {
//   const navigate = useNavigate();
//   const [otpOpen, setOtpOpen] = useState(false);
//   const [userInput, setUserInput] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(59);
//   const [isResendEnabled, setIsResendEnabled] = useState(false);

//   const validationSchema = Yup.object({
//     input: Yup.string()
//       .required("Email is required")
//       .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
//   });

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
//       await axios.post("/auth/request-otp", { email: values.input, mode: "login" });
//       toast.success("OTP resent successfully");
//       setOtp(["", "", "", "", "", ""]);
//       setTimer(59);
//       setIsResendEnabled(false);
//       toast.success("OTP resent successfully");
//     } catch (err) {
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

//   const handleOtpSubmit = async () => {
//     const otpValue = otp.join("");
//     try {
//       await axios.post("/auth/verify-otp", {
//         email: userInput,
//         code: otpValue,
//       });
//       toast.success("🎉 Welcome to your dashboard!");
//       setOtpOpen(false);
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Invalid OTP");
//     }
//   };

//   const handleFinalSubmit = async (values) => {
//     try {
//       await axios.post("/auth/request-otp", { email: values.input, mode: "login" });
//       toast.success("OTP sent successfully");
//       setUserInput(values.input);
//       setOtpOpen(true);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         toast.error(error.response?.data?.message || "There is no account exist by this email address");
//       } else {
//         toast.error(error.response?.data?.message || "Failed to send OTP");
//       }
//     }
//   };

//   return (
//     <Box className="user-login-main-box">
//       <Box className="user-login-box">
//         <Typography variant="h5" className="user-login-title">
//           Welcome To Ghumakkad User Login
//         </Typography>
//       </Box>

//       <Box className="user-login-form">
//         <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//           What's your email address to log in?
//         </Typography>

//         <Formik
//           initialValues={{ input: "" }}
//           validationSchema={validationSchema}
//           onSubmit={handleFinalSubmit}
//         >
//           {({ values, handleChange, handleSubmit, touched, errors }) => (
//             <form onSubmit={handleSubmit}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 label="Enter Your Email Address"
//                 name="input"
//                 value={values.input}
//                 onChange={handleChange}
//                 error={touched.input && Boolean(errors.input)}
//                 helperText={touched.input && errors.input}
//                 sx={{ mb: 2 }}
//               />
//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 className="user-login-button"
//               >
//                 Continue
//               </Button>
//             </form>
//           )}
//         </Formik>

//         <Divider sx={{ my: 2 }}>Or</Divider>

//         <Stack spacing={1.5}>
//           <Button
//             variant="contained"
//             fullWidth
//             startIcon={<GoogleIcon />}
//             className="user-login-social-button"
//           >
//             Continue With Google
//           </Button>
//         </Stack>

//         <Typography variant="body2" sx={{ mt: 3, mb: 3, textAlign: "justify" }}>
//           By proceeding, you consent to receive emails from Ghumakkad and its
//           partners at the provided email address.
//         </Typography>
//       </Box>

//       {/* OTP Dialog */}
//       <Dialog
//         open={otpOpen}
//         onClose={(event, reason) => {
//           if (reason !== "backdropClick") handleCloseOtp();
//         }}
//       >
//         <DialogContent className="otp-dialog">
//           <Typography variant="h6" fontWeight="bold" gutterBottom>
//             Enter the 6-digit code sent to:
//           </Typography>
//           <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
//             {userInput}
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
//                 className="user-login-button"
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
//                 className="user-login-button"
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

// export default UserLogin;













  import React, { useState, useEffect } from 'react';
import './UserLogin.css';

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
} from '../../../validations/userValidation';

import { requestLoginOtp, verifyOtp } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { startOtpTimer, formatTime } from '../../../utils/otpTimer';

const UserLogin = () => {
  const navigate = useNavigate();

  /* ------------- email / mobile form state ------------- */
  const [identifier, setIdentifier] = useState('');

  /* ------------- OTP modal state ------------- */
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);   // 6‑digit array
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [timerId, setTimerId] = useState(null);

  /* ------------- handle OTP timer ------------- */
  useEffect(() => {
    if (otpOpen) {
      // (re)start timer every time the dialog opens
      if (timerId) clearInterval(timerId);
      setIsResendEnabled(false);
      setTimer(60);
      const id = startOtpTimer(setTimer, 60);
      setTimerId(id);
      return () => clearInterval(id);
    }
  }, [otpOpen]);

  /* ------------- identifier form submit ------------- */
  const handleIdentifierSubmit = async (values, { setSubmitting }) => {
    
    try {
      await requestLoginOtp(values.identifier, 'login');       
      toast.success('OTP sent successfully');
      setIdentifier(values.identifier);
      setOtpOpen(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };
  

  /* ------------- resend OTP ------------- */
  const handleResend = async () => {
    try {
      await requestLoginOtp(identifier, 'login');
      toast.success('OTP resent');
      setOtp(['', '', '', '', '', '']);
      setIsResendEnabled(false);
      // restart timer
      if (timerId) clearInterval(timerId);
      const id = startOtpTimer(setTimer, 60);
      setTimerId(id);
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  /* ------------- OTP change helpers ------------- */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;       // allow only 0‑9 or empty
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

  /* ------------- OTP submit ------------- */
  const handleOtpSubmit = async () => {
    const code = otp.join('');    
    try {
      await verifyOtp(identifier, code);
      
      toast.success('🎉 Welcome to your dashboard!');
      setOtpOpen(false);
      navigate('/user/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    }
  };

  return (
    <Box className="user-login-main-box">
      {/* ---------- title ---------- */}
      <Box className="user-login-box">
        <Typography variant="h5" className="user-login-title">
          Welcome To Ghumakkad User Login
        </Typography>
      </Box>

      {/* ---------- identifier form ---------- */}
      <Box className="user-login-form">
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          What's your email address to log in?
        </Typography>

        <Formik
          initialValues={{ identifier: '' }}
          validationSchema={userLoginSignupSchema}
          onSubmit={handleIdentifierSubmit}
        >
          {({ values, handleChange, handleSubmit, touched, errors, isSubmitting }) => (
            
            <form onSubmit={handleSubmit}>
              {console.log(handleSubmit)}
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
                className="user-login-button"
              >
                Continue
              </Button>
            </form>
          )}
        </Formik>

        <Divider sx={{ my: 2 }}>Or</Divider>

        <Stack spacing={1.5}>
          <Button variant="contained" fullWidth className="user-login-social-button">
            Continue with Google
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 3, mb: 3, textAlign: 'justify' }}>
          By proceeding, you consent to receive emails from Ghumakkad and its partners
          at the provided email address.
        </Typography>
      </Box>

      {/* ---------- OTP dialog ---------- */}
      <Dialog
        open={otpOpen}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') setOtpOpen(false);
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

          {/* ----- resend & next actions ----- */}
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
                className="user-login-button"
              >
                Resend
              </Button>
            </Box>

            <Box className="otp-next-box">
              <IconButton onClick={() => setOtpOpen(false)}>
                <ArrowBackIcon />
              </IconButton>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                disabled={otp.join('').length !== 6}
                onClick={handleOtpSubmit}
                className="user-login-button"
              >
                Next
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserLogin;
