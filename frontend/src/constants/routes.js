// All route paths used in the app, grouped by role

const ROUTES = {
  HOME: '/',
  
  USER: {
    LOGIN: '/user/login',
    SIGNUP: '/user/signup',
    DASHBOARD: '/user/dashboard',
    PROFILE: '/user/profile',
    PAYMENT: '/user/payment',
  },

  CAPTAIN: {
    LOGIN: '/captain/login',
    SIGNUP: '/captain/signup',
    DASHBOARD: '/captain/dashboard',
    PROFILE: '/captain/profile',
    PAYMENT: '/captain/payment',
  },

  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PROFILE: '/admin/profile',
    USERS: '/admin/users',
    CAPTAINS: '/admin/captains',
    SETTINGS: '/admin/settings',
  },
};

export default ROUTES;
