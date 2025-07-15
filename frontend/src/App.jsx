import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import CaptainLoginSignUp from './components/captain/captainLoginSignup/CaptainLoginSignUp';
import UserLogin from './components/user/login/UserLogin';
import UserSignup from './components/user/signup/UserSignup';

const App = () => {

  return (
   <>
      <Routes>
         <Route path='/' element={<Home />} />
         {/* <Route path='/user-login' element={<UserLoginSignUp mode='login'/>} />
         <Route path='/user-signup' element={<UserLoginSignUp mode='signup'/>} /> */}
         <Route path='/user-login' element={<UserLogin />} />
         <Route path='/user-signup' element={<UserSignup />} />
         <Route path='/captain-login' element={<CaptainLoginSignUp />} />
         <Route path='/captain-signup' element={<CaptainLoginSignUp />} />
      </Routes>
   </>
  )
}

export default App;