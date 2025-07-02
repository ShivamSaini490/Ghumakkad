import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CaptainLoginSignUp from './pages/captain/CaptainLoginSignUp'
import UserLoginSignUp from './pages/user/UserLoginSignUp'

const App = () => {
   console.log("start");
   
  return (
   <>
      <Routes>
         <Route path='/' element={<Home />} />
         <Route path='/user-login' element={<UserLoginSignUp mode='login'/>} />
         <Route path='/user-signup' element={<UserLoginSignUp mode='signup'/>} />
         <Route path='/captain-login' element={<CaptainLoginSignUp />} />
         <Route path='/captain-signup' element={<CaptainLoginSignUp />} />
      </Routes>
   </>
  )
}

export default App;