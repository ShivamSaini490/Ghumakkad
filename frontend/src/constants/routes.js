// All route paths used in the app, grouped by role

// const ROUTES = {
//   HOME: '/',
  
//   USER: {
//     LOGIN: '/user/login',
//     SIGNUP: '/user/signup',
//     DASHBOARD: '/user/dashboard',
//     PROFILE: '/user/profile',
//     PAYMENT: '/user/payment',
//   },

//   CAPTAIN: {
//     LOGIN: '/captain/login',
//     SIGNUP: '/captain/signup',
//     DASHBOARD: '/captain/dashboard',
//     PROFILE: '/captain/profile',
//     PAYMENT: '/captain/payment',
//   },

//   ADMIN: {
//     LOGIN: '/admin/login',
//     DASHBOARD: '/admin/dashboard',
//     PROFILE: '/admin/profile',
//     USERS: '/admin/users',
//     CAPTAINS: '/admin/captains',
//     SETTINGS: '/admin/settings',
//   },
// };

// export default ROUTES;











export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const USER = '/users';
export const CAPTAIN = '/captains';
export const ADMIN = '/admin';

// USER subroutes
export const LOGIN = '/auth/request-login-otp';
export const SIGNUP = '/auth/request-signup-otp';
export const VERIFY_OTP = '/auth/verify-otp';
export const SIGNUP_COMPLETE = '/auth/signup-complete';
export const PROFILE = '/profile';
