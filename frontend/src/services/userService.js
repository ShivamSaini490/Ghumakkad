// import axios from "./axios";

// // ✅ Request OTP for signup
// export const requestSignupOtp = async (email) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:8081/users/auth/request-signup-otp",
//       { email },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "OTP request failed" };
//   }
// };

// // ✅ Request OTP for login
// export const requestLoginOtp = async (email) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:8081/users/auth/request-login-otp",
//       { email },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "OTP request failed" };
//   }
// };

// // ✅ Verify OTP
// export const verifyOtp = async (email, code) => {
//   try {
//     const response = await axios.post(
//       "/auth/verify-otp",
//       { email, code },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "OTP verification failed" };
//   }
// };

// // ✅ Complete user signup
// export const completeSignup = async (profileData) => {
//   try {
//     const response = await axios.post("/auth/signup-complete", profileData, {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Signup completion failed" };
//   }
// };

// // ✅ Fetch current logged-in user
// export const fetchCurrentUser = async () => {
//   try {
//     const response = await axios.get("http://localhost:8081/users/profile", {
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: "Fetching user failed" };
//   }
// };












import axios from './axios';
import {
  BASE_URL,
  USER,
  LOGIN,
  SIGNUP,
  VERIFY_OTP,
  SIGNUP_COMPLETE,
  PROFILE,
} from '../constants/routes';

export const requestSignupOtp = async (email) => {
  const response = await axios.post(BASE_URL + USER + SIGNUP, { email }, { withCredentials: true });
  return response.data;
};

export const requestLoginOtp = async (email) => {
  const response = await axios.post(BASE_URL + USER + LOGIN, { email }, { withCredentials: true });
  return response.data;
};

export const verifyOtp = async (email, code) => {
  const response = await axios.post(BASE_URL + USER + VERIFY_OTP, { email, code }, { withCredentials: true });
  return response.data;
};

export const completeSignup = async (profileData) => {
  const response = await axios.post(BASE_URL + USER + SIGNUP_COMPLETE + PROFILE, { withCredentials: true });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await axios.get(BASE_URL + USER + PROFILE, { withCredentials: true });
  return response.data;
};
