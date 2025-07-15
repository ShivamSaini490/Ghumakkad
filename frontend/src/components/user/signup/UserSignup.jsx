import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GoogleIcon from "@mui/icons-material/Google";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./UserSignup.css";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

const emailValidationSchema = Yup.object({
  input: Yup.string()
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
});

const profileValidationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  mobile: Yup.string()
    .required("Required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  gender: Yup.string().required("Required"),
  dob: Yup.date().required("Required"),
  agree: Yup.boolean().oneOf([true], "You must accept the terms"),
});

const UserSignup = () => {
  const [step, setStep] = useState("email"); // email, otp, profile
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    let interval;
    if (step === "otp") {
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
  }, [step]);

  const handleResend = async () => {
    try {
      await axios.post("/auth/request-otp", { email: userEmail });
      setOtp(["", "", "", "", "", ""]);
      setTimer(59);
      setIsResendEnabled(false);
      toast.success("OTP resent successfully");
    } catch {
      toast.error("Failed to resend OTP");
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

  const handleEmailSubmit = async (values) => {
    try {
      await axios.post("/auth/request-otp", { email: values.input });
      setUserEmail(values.input);
      setStep("otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const code = otp.join("");
      await axios.post("/auth/verify-otp", { email: userEmail, code });
      toast.success("OTP verified successfully");
      setStep("profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post("/auth/signup-complete", { email: userEmail, ...values });
      toast.success("🎉 Account created successfully!");
      setStep("success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
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

      {step === "email" && (
        <Box className="signup-form-box">
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Sign up with your email address
          </Typography>
          <Formik
            initialValues={{ input: "" }}
            validationSchema={emailValidationSchema}
            onSubmit={handleEmailSubmit}
          >
            {({ values, handleChange, handleSubmit, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Enter Your Email Address"
                  name="input"
                  value={values.input}
                  onChange={handleChange}
                  error={touched.input && Boolean(errors.input)}
                  helperText={touched.input && errors.input}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" fullWidth variant="contained" className="signup-button">
                  Continue
                </Button>
              </form>
            )}
          </Formik>

          <Divider sx={{ my: 2 }}>Or</Divider>

          <Button fullWidth variant="contained" startIcon={<GoogleIcon />} className="signup-social">
            Continue With Google
          </Button>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "justify" }}>
            By proceeding, you consent to receive emails from Ghumakkad and its partners.
          </Typography>
        </Box>
      )}

      {step === "otp" && (
        <Box className="signup-form-box">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Enter the 6-digit code sent to:
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            {userEmail}
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
              <Button onClick={handleResend} disabled={!isResendEnabled} className="signup-button">
                Resend
              </Button>
            </Box>

            <Box className="otp-next-box">
              <IconButton onClick={() => setStep("email")}>
                <ArrowBackIcon />
              </IconButton>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleOtpSubmit}
                className="signup-button"
                disabled={otp.join("").length !== 6}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {step === "profile" && (
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
            validationSchema={profileValidationSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
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
                    label="Mobile Number"
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
                        <a href="#" style={{ color: "#1976d2" }}>Terms</a> &{" "}
                        <a href="#" style={{ color: "#1976d2" }}>Privacy Policy</a>.
                        By clicking submit, you confirm you are 18+.
                      </Typography>
                    }
                  />
                  {touched.agree && Boolean(errors.agree) && (
                    <Typography variant="caption" color="error">
                      {errors.agree}
                    </Typography>
                  )}
                  <Button type="submit" variant="contained" className="signup-button">
                    Submit
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      )}

      {step === "success" && (
        <Typography variant="h6" sx={{ mt: 5, textAlign: "center", color: "green" }}>
          ✅ Signup completed successfully. You can now login!
        </Typography>
      )}
    </Box>
  );
};

export default UserSignup;
