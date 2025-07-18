// import { AuthContext } from "../context/AuthContext";

// // Utility to check if the user has a valid role
// export const isAuthorized = (user, allowedRoles = []) => {
//   if (!user || !user.role) return false;
//   return allowedRoles.includes(user.role);
// };

// // Optional: utility to extract token from cookies (if needed manually)
// export const getTokenFromCookies = () => {
//   const match = document.cookie.match(/token=([^;]+)/);
//   return match ? match[1] : null;
// };

// // Optional: Save role/user in localStorage (if used)
// export const saveUserToLocal = (user) => {
//   localStorage.setItem('user', JSON.stringify(user));
// };

// export const getUserFromLocal = () => {
//   const user = localStorage.getItem('user');
//   return user ? JSON.parse(user) : null;
// };

// export const clearUserFromLocal = () => {
//   localStorage.removeItem('user');
// };

// export const getUserFromToken = (token) => {
//   // Example: decode JWT (requires jwt-decode package)
//   // import jwt_decode from "jwt-decode";
//   // return jwt_decode(token);
//   return null; // Or your logic here
// };

// export const useAuth = () => useContext(AuthContext);


import { useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
