import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLoginSignUp.css";
import axios from "../../../api/axios";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Formik } from "formik";
import * as Yup from "yup";
import GoogleIcon from "@mui/icons-material/Google";

const UserLoginSignUp = ({ mode = "login" }) => {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const [otpOpen, setOtpOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const validationSchema = Yup.object({
    input: Yup.string()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
  });

  useEffect(() => {
    let interval;
    if (otpOpen) {
      setTimer(59);
      setIsResendEnabled(false);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpOpen]);

  const handleResend = async () => {
  try {
    await axios.post('/auth/request-otp', { email: userInput });
    setOtp(["", "", "", "", "", ""]);
    setTimer(59);
    setIsResendEnabled(false);
  } catch (err) {
    alert("Failed to resend OTP");
  }
};


  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleCloseOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpOpen(false);
  };

  const handleOtpSubmit = async () => {
  const otpValue = otp.join("");
  try {
    const res = await axios.post("/auth/verify-otp", {
      email: userInput,
      code: otpValue // ✅ correct key for backend
    });

    setOtpOpen(false);
    if (mode === "signup") {
      navigate("/userprofile", { state: { email: userInput } });
    } else {
      alert("Welcome To The Dashboard");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Invalid OTP");
  }
};


  const handleFinalSubmit = async (values) => {
    try {
      await axios.post('/auth/request-otp', { email: values.input });
      setUserInput(values.input);
      setOtpOpen(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());

  return (
    <Box className="user-login-signup-main-box">
      <Box className="user-login-signup-box">
        <Typography variant="h5" className="user-login-signup-title">
          Welcome To Ghumakkad User {isLogin ? "Login" : "Sign Up"}
        </Typography>
      </Box>

      <Box className="user-login-signup-form">
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          {isLogin
            ? "What's your email address to log in?"
            : "Sign up with your email address"}
        </Typography>

        <Formik
          initialValues={{ input: "" }}
          validationSchema={validationSchema}
          onSubmit={handleFinalSubmit}
        >
          {({ values, handleChange, handleSubmit, touched, errors }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter Your Email Address"
                name="input"
                value={values.input}
                onChange={handleChange}
                error={touched.input && Boolean(errors.input)}
                helperText={touched.input && errors.input}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="user-login-signup-button"
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
            startIcon={<GoogleIcon />}
            className="user-login-social-media-button"
          >
            Continue With Google
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 3, mb: 3, textAlign: "justify" }}>
          By proceeding, you consent to receive emails from Ghumakkad and its
          partners at the provided email address.
        </Typography>
      </Box>

      {/* OTP Dialog */}
      <Dialog
        open={otpOpen}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") handleCloseOtp();
        }}
      >
        <DialogContent className="otp-dialog">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Enter the 6-digit code sent to:
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            {userInput}
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

          <Typography variant="body2" sx={{ mt: 1 }}>
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
                className="user-login-signup-button"
                disabled={!isResendEnabled}
                onClick={handleResend}
              >
                Resend
              </Button>
            </Box>

            <Box className="otp-next-box">
              <IconButton onClick={handleCloseOtp}>
                <ArrowBackIcon />
              </IconButton>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleOtpSubmit}
                className="user-login-signup-button"
                disabled={otp.join("").length !== 6}
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

export default UserLoginSignUp;