// import React from 'react'
// import './App.css'
// import { Routes, Route } from 'react-router-dom'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import UserLogin from './pages/user/login/UserLogin.jsx'
// import UserSignup from './pages/user/signup/UserSignup.jsx'

// const App = () => {

//   return (
//    <>
//       <Routes>
//          <Route path='/' element={<Home />} />
//          <Route path='/user-login' element={<UserLogin />} />
//          <Route path='/user-signup' element={<UserSignup />} />
//       </Routes>
//       <ToastContainer position="top-center" autoClose={3000} />
//    </>
//   )
// }

// export default App;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import UserLogin from "./pages/user/login/UserLogin";
import UserSignup from "./pages/user/signup/UserSignup";
import UserDashboard from "./pages/user/dashboard/UserDashboard";
// import UserProfile from "./pages/user/profile/UserProfile";
import Home from "./pages/home/Home";

import ProtectedRoute from "./components/common/ProtectedRoute";
import ROLES from "./constants/roles";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />

        {/* Protected User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/user/payment"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <UserPayment />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLES.USER]}>
              <UserProfile />
            </ProtectedRoute>
          }
        /> */}

        {/* Future Captain and Admin Routes */}
        {/* Add similar protected routes for captain and admin roles */}

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
