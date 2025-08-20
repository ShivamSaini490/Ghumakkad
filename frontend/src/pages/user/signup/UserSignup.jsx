// import React, { useState, useEffect } from "react";
// import "./UserSignup.css";

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
//   MenuItem,
// } from "@mui/material";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// import { Formik } from "formik";
// import {
//   userLoginSignupSchema,
//   otpValidationSchema,
//   userProfileSchema,
// } from "../../../validations/userValidation";

// import {
//   requestSignupOtp,
//   verifyOtp,
//   completeSignup,
// } from "../../../services/userService";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { startOtpTimer, formatTime } from "../../../utils/otpTimer";

// const UserSignup = () => {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = profile
//   const [identifier, setIdentifier] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(60);
//   const [isResendEnabled, setIsResendEnabled] = useState(false);
//   const [timerId, setTimerId] = useState(null);

//   useEffect(() => {
//     if (step === 2) {
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
//   }, [step]);

//   const handleIdentifierSubmit = async (values, { setSubmitting }) => {
//     try {
//       console.log("Sending OTP to:", values);

//       await requestSignupOtp(values.identifier, "signup");
//       toast.success("OTP sent successfully");
//       setIdentifier(values.identifier);
//       setStep(2);
//     } catch (err) {
//       toast.error(err.message || "Failed to send OTP");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await requestSignupOtp(identifier);
//       toast.success("OTP resent successfully");
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

//   const handleOtpChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;
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

//   const handleOtpSubmit = async () => {
//     const code = otp.join("");
//     try {
//       await verifyOtp(identifier, code);
//       toast.success("OTP Verified");
//       setStep(3);
//     } catch (err) {
//       toast.error(err.message || "Invalid OTP");
//     }
//   };

//   const handleProfileSubmit = async (values, { setSubmitting }) => {
//     try {
//       await completeSignup({ ...values, email: identifier });
//       toast.success("Signup complete! 🎉");
//       navigate("/user/dashboard");
//     } catch (err) {
//       toast.error(err.message || "Signup failed");
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

//       {/* Step 1: Email input */}
//       {step === 1 && (
//         <Box className="signup-form-box">
//           <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
//             Sign up with your email address
//           </Typography>

//           <Formik
//             initialValues={{ identifier: "" }}
//             validationSchema={userLoginSignupSchema}
//             onSubmit={handleIdentifierSubmit}
//           >
//             {({
//               values,
//               handleChange,
//               handleSubmit,
//               touched,
//               errors,
//               isSubmitting,
//             }) => (
//               <form onSubmit={handleSubmit}>
//                 <TextField
//                   fullWidth
//                   name="identifier"
//                   label="Enter Your Email Address"
//                   value={values.identifier}
//                   onChange={handleChange}
//                   error={touched.identifier && Boolean(errors.identifier)}
//                   helperText={touched.identifier && errors.identifier}
//                   sx={{ mb: 2 }}
//                 />
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="signup-button"
//                 >
//                   Continue
//                 </Button>
//               </form>
//             )}
//           </Formik>

//           <Divider sx={{ my: 2 }}>Or</Divider>

//           <Button
//             fullWidth
//             variant="contained"
//             className="signup-social"
//           >
//             Continue With Google
//           </Button>
//              <Button
//                   fullWidth
//                   variant="contained"
//                   className="signup-social"
//                   sx={{ mt: 2 }}
//                   onClick={() => window.location.href = '/user/login'}
//                 >
//                   Sign In
//                 </Button>
//           <Typography variant="body2" sx={{ mt: 3, textAlign: "justify" }}>
//             By proceeding, you consent to receive emails from Ghumakkad and its partners at the provided email address.
//           </Typography>
//         </Box>
//       )}

//       {/* Step 2: OTP Modal */}
//       <Dialog
//         open={step === 2}
//         onClose={(e, reason) => {
//           if (reason !== "backdropClick") setStep(1);
//         }}
//       >
//         <DialogTitle sx={{ textAlign: "center" }}>
//           Enter the 6-digit code sent to
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
//                 disabled={!isResendEnabled}
//                 onClick={handleResend}
//                 className="signup-button"
//               >
//                 Resend
//               </Button>
//             </Box>

//             <Box className="otp-next-box">
//               <IconButton onClick={() => setStep(1)}>
//                 <ArrowBackIcon />
//               </IconButton>
//               <Button
//                 variant="contained"
//                 endIcon={<ArrowForwardIcon />}
//                 disabled={otp.join("").length !== 6}
//                 onClick={handleOtpSubmit}
//                 className="signup-button"
//               >
//                 Next
//               </Button>
//             </Box>
//           </Box>
//         </DialogContent>
//       </Dialog>

//       {/* Step 3: Profile Form */}
//       {step === 3 && (
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
//             validationSchema={userProfileSchema}
//             onSubmit={handleProfileSubmit}
//           >
//             {({
//               values,
//               handleChange,
//               handleSubmit,
//               touched,
//               errors,
//               isSubmitting,
//               isValid,
//             }) => (
//               <form onSubmit={handleSubmit}>
//                 <TextField
//                   fullWidth
//                   name="firstName"
//                   label="First Name"
//                   value={values.firstName}
//                   onChange={handleChange}
//                   error={touched.firstName && Boolean(errors.firstName)}
//                   helperText={touched.firstName && errors.firstName}
//                   sx={{ mb: 2 }}
//                 />

//                 <TextField
//                   fullWidth
//                   name="lastName"
//                   label="Last Name"
//                   value={values.lastName}
//                   onChange={handleChange}
//                   error={touched.lastName && Boolean(errors.lastName)}
//                   helperText={touched.lastName && errors.lastName}
//                   sx={{ mb: 2 }}
//                 />

//                 <TextField
//                   fullWidth
//                   name="mobile"
//                   label="Mobile Number"
//                   value={values.mobile}
//                   onChange={handleChange}
//                   error={touched.mobile && Boolean(errors.mobile)}
//                   helperText={touched.mobile && errors.mobile}
//                   sx={{ mb: 2 }}
//                 />

//                 <TextField
//                   select
//                   fullWidth
//                   name="gender"
//                   label="Gender"
//                   value={values.gender}
//                   onChange={handleChange}
//                   error={touched.gender && Boolean(errors.gender)}
//                   helperText={touched.gender && errors.gender}
//                   sx={{ mb: 2 }}
//                 >
//                   <MenuItem value="">Select Gender</MenuItem>
//                   <MenuItem value="Male">Male</MenuItem>
//                   <MenuItem value="Female">Female</MenuItem>
//                   <MenuItem value="Other">Other</MenuItem>
//                 </TextField>
//                 <TextField
//                   fullWidth
//                   name="dob"
//                   label="Date of Birth"
//                   type="date"
//                   InputLabelProps={{ shrink: true }}
//                   value={values.dob}
//                   onChange={handleChange}
//                   error={touched.dob && Boolean(errors.dob)}
//                   helperText={touched.dob && errors.dob}
//                   sx={{ mb: 2 }}
//                 />

//                 <Box sx={{ mb: 2 }}>
//                   <label style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       name="agree"
//                       checked={values.agree}
//                       onChange={handleChange}
//                       style={{ marginRight: 8 }}
//                     />
//                     <Typography variant="body2">
//                       Accept Ghumakkad's <a href="#" style={{ color: "#1976d2" }}>Terms</a> & <a href="#" style={{ color: "#1976d2" }}>Privacy Policy</a>. By clicking submit, you confirm you are 18+.
//                     </Typography>
//                   </label>
//                   {touched.agree && Boolean(errors.agree) && (
//                     <Typography variant="caption" color="error">
//                       {errors.agree}
//                     </Typography>
//                   )}
//                 </Box>
//                 <Button
//                   fullWidth
//                   variant="contained"
//                   type="submit"
//                   disabled={isSubmitting || !values.agree}
//                   className="signup-button"
//                 >
//                   Submit
//                 </Button>
//               </form>
//             )}
//           </Formik>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default UserSignup;





//............................................................................................................................................................//






import React, { useState, useEffect } from "react";
import "./UserSignup.css";

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
  MenuItem,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Formik } from "formik";
import {
  userLoginSignupSchema,
  otpValidationSchema,
  userProfileSchema,
} from "../../../validations/userValidation";

import {
  requestSignupOtp,
  verifyOtp,
  completeSignup,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { startOtpTimer, formatTime } from "../../../utils/otpTimer";

const UserSignup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = profile
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (step === 2) {
      if (timerId) clearInterval(timerId);
      setIsResendEnabled(false);
      setTimer(60);
      window.onOtpTimerEnd = () => setIsResendEnabled(true);
      const id = startOtpTimer(setTimer, 60);
      setTimerId(id);
      return () => {
        clearInterval(id);
        window.onOtpTimerEnd = null;
      };
    }
  }, [step]);

  const handleIdentifierSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Sending OTP to:", values);

      await requestSignupOtp(values.identifier, "signup");
      toast.success("OTP sent successfully");
      setIdentifier(values.identifier);
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await requestSignupOtp(identifier);
      toast.success("OTP resent successfully");
      setOtp(["", "", "", "", "", ""]);
      setIsResendEnabled(false);
      setTimer(60);
      window.onOtpTimerEnd = () => setIsResendEnabled(true);
      if (timerId) clearInterval(timerId);
      const id = startOtpTimer(setTimer, 60);
      setTimerId(id);
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    try {
      await verifyOtp(identifier, code);
      toast.success("OTP Verified");
      setStep(3);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    }
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      await completeSignup({ ...values, email: identifier });
      toast.success("Signup complete! 🎉");
      navigate("/user/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="signup-container">
      <Box className="signup-header">
        <Typography variant="h5" className="signup-title">
          Welcome To Ghumakkad User Sign Up
        </Typography>
      </Box>

      {/* Step 1: Email input */}
      {step === 1 && (
        <Box className="signup-form-box">
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Sign up with your email address
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
                  className="signup-button"
                >
                  Continue
                </Button>
              </form>
            )}
          </Formik>

          <Divider sx={{ my: 2 }}>Or</Divider>

          <Button
            fullWidth
            variant="contained"
            className="signup-social"
          >
            Continue With Google
          </Button>
             <Button
                  fullWidth
                  variant="contained"
                  className="signup-social"
                  sx={{ mt: 2 }}
                  onClick={() => window.location.href = '/user/login'}
                >
                  Sign In
                </Button>
          <Typography variant="body2" sx={{ mt: 3, textAlign: "justify" }}>
            By proceeding, you consent to receive emails from Ghumakkad and its partners at the provided email address.
          </Typography>
        </Box>
      )}

      {/* Step 2: OTP Modal */}
      <Dialog
        open={step === 2}
        onClose={(e, reason) => {
          if (reason !== "backdropClick") setStep(1);
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
            Tip: Check your inbox or spam folder for the code.
          </Typography>

          <Box className="otp-actions">
            <Box className="otp-resend-box">
              <Typography variant="body2" color="textSecondary">
                {isResendEnabled
                  ? "You can now resend the code"
                  : `Resend in 00:${timer < 10 ? `0${timer}` : timer}`}
              </Typography>
              <Button
                variant="contained"
                disabled={!isResendEnabled}
                onClick={handleResend}
                className="signup-button"
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
                disabled={otp.join("").length !== 6}
                onClick={handleOtpSubmit}
                className="signup-button"
              >
                Next
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Step 3: Profile Form */}
      {step === 3 && (
        <Box className="signup-form-box">
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Complete Your Profile
          </Typography>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              mobile: "",
              gender: "",
              dob: "",
              agree: false,
            }}
            validationSchema={userProfileSchema}
            onSubmit={handleProfileSubmit}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              touched,
              errors,
              isSubmitting,
              isValid,
            }) => (
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
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
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
                  <label style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      name="agree"
                      checked={values.agree}
                      onChange={handleChange}
                      style={{ marginRight: 8 }}
                    />
                    <Typography variant="body2">
                      Accept Ghumakkad's <a href="#" style={{ color: "#1976d2" }}>Terms</a> & <a href="#" style={{ color: "#1976d2" }}>Privacy Policy</a>. By clicking submit, you confirm you are 18+.
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
                  disabled={isSubmitting || !values.agree}
                  className="signup-button"
                >
                  Submit
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