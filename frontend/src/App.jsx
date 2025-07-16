import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CaptainLoginSignUp from './components/captain/captainLoginSignup/CaptainLoginSignUp';
import UserLogin from './components/user/login/UserLogin';
import UserSignup from './components/user/signup/UserSignup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
   <>
      <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/user-login' element={<UserLogin />} />
         <Route path='/user-signup' element={<UserSignup />} />
         <Route path='/captain-login' element={<CaptainLoginSignUp />} />
         <Route path='/captain-signup' element={<CaptainLoginSignUp />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
   </>
  )
}

export default App;