/**
 * OTP Session Model
 * This structure is used to manage in-memory OTP session state.
 */

/**
 * @typedef {Object} OTPSession
 * @property {string} otp - The generated OTP
 * @property {Date} expiresAt - Expiration time of the OTP
 * @property {boolean} isVerified - Whether the OTP has been verified
 */

/**
 * Create a new OTP session object
 * @param {string} otp - The OTP code
 * @returns {OTPSession}
 */
export const createOtpSession = (otp) => {
  return {
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    isVerified: false,
  };
};
