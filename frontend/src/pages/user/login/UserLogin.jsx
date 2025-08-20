// import React, { useState, useEffect } from "react";
// import "./UserLogin.css";

// import {
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   IconButton,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// import { Formik } from "formik";
// import {
//   userLoginSignupSchema,
//   otpValidationSchema,
// } from "../../../validations/userValidation";

// import { requestLoginOtp, verifyOtp } from "../../../services/userService";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// import { startOtpTimer, formatTime } from "../../../utils/otpTimer";

// const UserLogin = () => {
//   const navigate = useNavigate();

//   /* ------------- email / mobile form state ------------- */
//   const [identifier, setIdentifier] = useState("");

//   /* ------------- OTP modal state ------------- */
//   const [otpOpen, setOtpOpen] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6‑digit array
//   const [timer, setTimer] = useState(60);
//   const [isResendEnabled, setIsResendEnabled] = useState(false);
//   const [timerId, setTimerId] = useState(null);

//   /* ------------- handle OTP timer ------------- */
//   useEffect(() => {
//     if (otpOpen) {
//       if (timerId) clearInterval(timerId);
//       setIsResendEnabled(false);
//       setTimer(60);
//       window.onOtpTimerEnd = () => setIsResendEnabled(true);
//       const id = startOtpTimer(setTimer, 60);
//       setTimerId(id);
//       return () => {
//         clearInterval(id);
//         window.onOtpTimerEnd = null;
//       };
//     }
//   }, [otpOpen]);

//   /* ------------- identifier form submit ------------- */
//   const handleIdentifierSubmit = async (values, { setSubmitting }) => {
//     try {
//       await requestLoginOtp(values.identifier, "login");
//       toast.success("OTP sent successfully");
//       setIdentifier(values.identifier);
//       setOtpOpen(true);
//     } catch (err) {
//       toast.error(err.message || "Failed to send OTP");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ------------- resend OTP ------------- */
//   const handleResend = async () => {
//     try {
//       await requestLoginOtp(identifier, "login");
//       toast.success("OTP resent");
//       setOtp(["", "", "", "", "", ""]);
//       setIsResendEnabled(false);
//       setTimer(60);
//       window.onOtpTimerEnd = () => setIsResendEnabled(true);
//       if (timerId) clearInterval(timerId);
//       const id = startOtpTimer(setTimer, 60);
//       setTimerId(id);
//     } catch (err) {
//       toast.error(err.message || "Failed to resend OTP");
//     }
//   };

//   /* ------------- OTP change helpers ------------- */
//   const handleOtpChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return; // allow only 0‑9 or empty
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && index < 5) {
//       const next = document.getElementById(`otp-${index + 1}`);
//       if (next) next.focus();
//     }
//   };

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       const prev = document.getElementById(`otp-${index - 1}`);
//       if (prev) prev.focus();
//     }
//   };

//   /* ------------- OTP submit ------------- */
//   const handleOtpSubmit = async () => {
//     const code = otp.join("");
//     try {
//       await verifyOtp(identifier, code);

//       toast.success("🎉 Welcome to your dashboard!");
//       setOtpOpen(false);
//       navigate("/user/dashboard");
//     } catch (err) {
//       toast.error(err.message || "Invalid OTP");
//     }
//   };

//   return (
//     <Box className="user-login-main-box">
//       {/* ---------- title ---------- */}
//       <Box className="user-login-box">
//         <Typography variant="h5" className="user-login-title">
//           Welcome To Ghumakkad User Login
//         </Typography>
//       </Box>

//       {/* ---------- identifier form ---------- */}
//       <Box className="user-login-form">
//         <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//           What's your email address to log in?
//         </Typography>

//         <Formik
//           initialValues={{ identifier: "" }}
//           validationSchema={userLoginSignupSchema}
//           onSubmit={handleIdentifierSubmit}
//         >
//           {({
//             values,
//             handleChange,
//             handleSubmit,
//             touched,
//             errors,
//             isSubmitting,
//           }) => (
//             <form onSubmit={handleSubmit}>
//               {console.log(handleSubmit)}
//               <TextField
//                 fullWidth
//                 name="identifier"
//                 label="Enter Your Email Address"
//                 value={values.identifier}
//                 onChange={handleChange}
//                 error={touched.identifier && Boolean(errors.identifier)}
//                 helperText={touched.identifier && errors.identifier}
//                 sx={{ mb: 2 }}
//               />
//               <Button
//                 fullWidth
//                 variant="contained"
//                 type="submit"
//                 disabled={isSubmitting}
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
//             className="user-login-social-button"
//           >
//             Continue with Google
//           </Button>
//         </Stack>

//         <Button
//           fullWidth
//           variant="contained"
//           className="signup-social"
//           sx={{ mt: 2 }}
//           onClick={() => (window.location.href = "/user/signup")}
//         >
//           Sign Up
//         </Button>

//         <Typography variant="body2" sx={{ mt: 3, mb: 3, textAlign: "justify" }}>
//           By proceeding, you consent to receive emails from Ghumakkad and its
//           partners at the provided email address.
//         </Typography>
//       </Box>

//       {/* ---------- OTP dialog ---------- */}
//       <Dialog
//         open={otpOpen}
//         onClose={(e, reason) => {
//           if (reason !== "backdropClick") setOtpOpen(false);
//         }}
//       >
//         <DialogTitle sx={{ textAlign: "center" }}>
//           Enter the 6‑digit code sent to
//         </DialogTitle>
//         <DialogContent className="otp-dialog">
//           <Typography
//             variant="h6"
//             fontWeight="bold"
//             sx={{ mb: 2, textAlign: "center" }}
//           >
//             {identifier}
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

//           <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
//             Tip: check your inbox or spam folder for the code.
//           </Typography>

//           {/* ----- resend & next actions ----- */}
//           <Box className="otp-actions">
//             <Box className="otp-resend-box">
//               <Typography variant="body2" color="textSecondary">
//                 {isResendEnabled
//                   ? "You can now resend the code"
//                   : `Resend in ${formatTime(timer)}`}
//               </Typography>
//               <Button
//                 variant="contained"
//                 disabled={!isResendEnabled}
//                 onClick={handleResend}
//                 className="user-login-button"
//               >
//                 Resend
//               </Button>
//             </Box>

//             <Box className="otp-next-box">
//               <IconButton onClick={() => setOtpOpen(false)}>
//                 <ArrowBackIcon />
//               </IconButton>
//               <Button
//                 variant="contained"
//                 endIcon={<ArrowForwardIcon />}
//                 disabled={otp.join("").length !== 6}
//                 onClick={handleOtpSubmit}
//                 className="user-login-button"
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



//..........................................................................................................................................................//


import React, { useState, useEffect, useRef } from "react";
import "./UserLogin.css";

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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Formik } from "formik";
import {
  userLoginSignupSchema,
  otpValidationSchema,
} from "../../../validations/userValidation";

import { requestLoginOtp, verifyOtp } from "../../../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { formatTime } from "../../../utils/otpTimer";

const UserLogin = () => {
  const navigate = useNavigate();

  /* ------------- email / mobile form state ------------- */
  const [identifier, setIdentifier] = useState("");

  /* ------------- OTP modal state ------------- */
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit array
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const timerRef = useRef(null);

  /* ------------- handle OTP timer ------------- */
  useEffect(() => {
    if (otpOpen) {
      // clear existing interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsResendEnabled(false);
      setTimer(60);

      // start local countdown to avoid relying on globals
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // cleanup on close or unmount
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
    // if otpOpen false, ensure timer cleared
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [otpOpen]);

  /* ------------- identifier form submit ------------- */
  const handleIdentifierSubmit = async (values, { setSubmitting }) => {
    try {
      await requestLoginOtp(values.identifier, "login");
      toast.success("OTP sent successfully");
      setIdentifier(values.identifier);
      setOtpOpen(true);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------- resend OTP ------------- */
  const handleResend = async () => {
    try {
      await requestLoginOtp(identifier, "login");
      toast.success("OTP resent");
      setOtp(["", "", "", "", "", ""]);
      setIsResendEnabled(false);
      setTimer(60);

      // restart local countdown
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  /* ------------- OTP change helpers ------------- */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only 0-9 or empty
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  /* ------------- OTP submit ------------- */
  const handleOtpSubmit = async () => {
    const code = otp.join("");
    try {
      await verifyOtp(identifier, code);

      toast.success("🎉 Welcome to your dashboard!");
      setOtpOpen(false);
      navigate("/user/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    }
  };

  return (
    <Box className="user-login-main-box">
      {/* ---------- title ---------- */}
      <Box className="user-login-box">
        <Typography variant="h5" className="user-login-title">
          Welcome To Ghumakkad User Sign In
        </Typography>
      </Box>

      {/* ---------- identifier form ---------- */}
      <Box className="user-login-form">
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          What's your email address to Sign In?
        </Typography>

        <Formik
          initialValues={{ identifier: "" }}
          validationSchema={userLoginSignupSchema}
          onSubmit={handleIdentifierSubmit}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            touched,
            errors,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="identifier"
                label="Enter Your Email Address"
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
          <Button
            variant="contained"
            fullWidth
            className="user-login-social-button"
          >
            Continue with Google
          </Button>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          className="signup-social"
          sx={{ mt: 2 }}
          onClick={() => (window.location.href = "/user/signup")}
        >
          Sign Up
        </Button>

        <Typography variant="body2" sx={{ mt: 3, mb: 3, textAlign: "justify" }}>
          By proceeding, you consent to receive emails from Ghumakkad and its
          partners at the provided email address.
        </Typography>
      </Box>

      {/* ---------- OTP dialog ---------- */}
     <Dialog
  open={otpOpen}
  fullWidth
  maxWidth="xs"
  onClose={(e, reason) => {
    if (reason !== "backdropClick") setOtpOpen(false);
  }}
  PaperProps={{
    sx: {
      borderRadius: '12px',
      width: '100%',
      maxWidth: '400px',   // cap at 400px on large screens
      mx: 2                // safe margin on small screens
    }
  }}
>

        <DialogTitle sx={{ textAlign: "center" }}>
          Enter the 6-digit code sent to
        </DialogTitle>
        <DialogContent className="otp-dialog">
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, textAlign: "center" }}
          >
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

          <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            Tip: check your inbox or spam folder for the code.
          </Typography>

          {/* ----- resend & next actions ----- */}
          <Box className="otp-actions">
            <Box className="otp-resend-box">
              <Typography variant="body2" color="textSecondary">
                {isResendEnabled
                  ? "You can now resend the code"
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
                disabled={otp.join("").length !== 6}
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
