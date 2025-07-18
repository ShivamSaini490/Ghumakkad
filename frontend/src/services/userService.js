import axios from './axios';

// Request OTP for signup
export const requestSignupOtp = async (email) => {
  try {
    const response = await axios.post('http://localhost:8081/users/auth/request-signup-otp', { email });
    console.log('OTP request successful:', response.data);
    return response.data;
    
  } catch (error) {
    throw error.response?.data || { message: 'OTP request failed' };
  }
};
// Request OTP for login 
export const requestLoginOtp = async (email) => {
  try {
    const response = await axios.post('http://localhost:8081/users/auth/request-login-otp', { email });
    console.log('OTP request successful:', response.data);
    return response.data;
    
  } catch (error) {
    throw error.response?.data || { message: 'OTP request failed' };
  }
};

// Verify OTP
export const verifyOtp = async (email, code) => {
  
  const response = await axios.post('/auth/verify-otp', { email, code });
  console.log('Verifying OTP for email:', email, 'with code:', code);
  return response.data;
};

// Complete user signup (for new users after OTP verification)
export const completeSignup = async (email, profileData) => {
  try {
    const response = await axios.post('/auth/signup-complete', {
      email,
      ...profileData,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup completion failed' };
  }
};

// Get current logged-in user (for AuthContext or ProtectedRoute)
export const fetchCurrentUser = async () => {
  try {
    const response = await axios.get('http://localhost:8081/users/profile', { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Fetching user failed' };
  }
};
