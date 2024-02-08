import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userAuth } from './atoms'

const AuthPage = () => {
const url = import.meta.env.VITE_URL ?? "https://paytmbackend-hcav.onrender.com"
const pahochaDe = useNavigate()
  const [Email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useRecoilState(userAuth)
      useEffect(()=>{
        const userToken = localStorage.getItem('authToken')
        if(userToken){
          setLogin(true)
        }
      },[setLogin,pahochaDe])
      if(login){
      return <Navigate to="/Dashboard" />
      }
    const signInHandler = async()=>{ 
        const {data} = await axios.post(`${url}/v1/signin`,{
            username:Email,password
        })
        if(data.token){
            toast("Successfully Signed In")
            await localStorage.setItem('authToken',data.token)
            setLogin(true)
            console.log(userAuth)
            pahochaDe('/Dashboard')
        } else {
            toast("Something went wrong")
            setLogin(false)
        }
    }
 
  return (
<Fragment>
  <div className='flex items-center justify-center h-screen bg-neutral-600 text-black font-sans'>
    <div className='bg-white w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-lg px-6 py-8'>
      <h3 className='text-3xl font-bold text-center mb-4'>Sign In</h3>
      <p className='text-center text-slate-500 mb-6'>Enter your credentials to access your account</p>        

      <div className='mb-4'>
        <label htmlFor="Email" className='block font-bold mb-2'>Email</label>
        <input
          id="Email"
          type="text"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter your email'
          required
        />
      </div>

      <div className='mb-6'>
        <label htmlFor="password" className='block font-bold mb-2'>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter your password'
          required
        />
      </div>

      <div>
      <button
  onClick={signInHandler}
  className="relative inline-flex items-center justify-center w-full px-5 py-3 overflow-hidden font-medium text-white bg-blue-600 rounded-full group"
>
  <span className="absolute inset-0 transition-all duration-100 ease-linear group-hover:bg-white rounded-full"></span>
  <span className="relative text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">
    Sign In
  </span>
</button>

      </div>

      <p className='mt-4 text-center text-sm'>
     Don't have an account? <Link to={'/'} className='underline font-medium text-blue-600  ' >Signin</Link>
      </p>
    </div>
  </div>
</Fragment>

  )
}

export default AuthPage
