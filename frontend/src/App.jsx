import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import UserProfile from './components/user/userProfile/UserProfile'
import UserLoginSignUp from './components/user/userLoginSignup/UserLoginSignUp'
import CaptainLoginSignUp from './components/captain/captainLoginSignup/CaptainLoginSignUp';

const App = () => {

  return (
   <>
      <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/user-login' element={<UserLoginSignUp mode='login'/>} />
         <Route path='/user-signup' element={<UserLoginSignUp mode='signup'/>} />
         <Route path='/captain-login' element={<CaptainLoginSignUp />} />
         <Route path='/captain-signup' element={<CaptainLoginSignUp />} />
         <Route path='/userprofile' element={<UserProfile />} />
      </Routes>
   </>
  )
}

export default App;