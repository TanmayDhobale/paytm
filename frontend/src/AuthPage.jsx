import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { userAuth } from './atoms'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import toast from 'react-hot-toast'
// import.meta.env.VITE_URL
const AuthPage = () => {
  const url = import.meta.env.VITE_URL ?? "https://paytmbackend-hcav.onrender.com"
  const [Email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [login, setLogin] = useRecoilState(userAuth)
  const pahochaDe = useNavigate()
      useEffect(()=>{
        const userToken = localStorage.getItem('authToken')
        if(userToken){
          setLogin(true)
        }
        },[setLogin,pahochaDe])
        const signUpHandler = async()=>{ 
          const {data} = await axios.post(`${url}/v1/signup`,{
             username:Email,password,firstName, lastName
          })
          if(data.token){
              toast("Successfully Signed In")
              await localStorage.setItem('authToken',data.token)
              setLogin(true)
              pahochaDe('/Dashboard')
          } else {
              toast("Something went wrong")
              setLogin(false)
          }
      }
      if(login){
        return <Navigate to="/Dashboard" />
        }
  return (
<Fragment>
    <div className='h-screen w-screen flex justify-center items-center bg-neutral-600 text-black font-sans'>
        <div className='bg-white w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-md p-6'>
            <h3 className='text-3xl font-bold text-center mb-4'>Sign Up</h3>
            <p className='text-sm text-slate-500 text-center mb-6'>Enter your information to create an account</p>
            
            <form className='space-y-4'>
                <div>
                    <label htmlFor="FirstName" className='font-bold text-sm'>First Name</label>
                    <input className='mt-1 p-2 w-full border rounded-md' value={firstName} onChange={(e)=>setfirstName(e.target.value)} type="text" placeholder='First name' />
                </div>
                <div>
                    <label htmlFor="lastname" className='font-bold text-sm'>Last Name</label>
                    <input className='mt-1 p-2 w-full border rounded-md' value={lastName} onChange={(e)=>setlastName(e.target.value)} type="text" placeholder='Last name' />
                </div>
                <div>
                    <label htmlFor="Email" className='font-bold text-sm'>Email</label>
                    <input className='mt-1 p-2 w-full border rounded-md' value={Email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' />
                </div>
                <div>
                    <label htmlFor="password" className='font-bold text-sm'>Password</label>
                    <input className='mt-1 p-2 w-full border rounded-md' value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' />
                </div>
                
              <button
  type="button"
  onClick={signUpHandler}
  className="relative inline-flex items-center justify-center w-full px-5 py-2 overflow-hidden font-medium text-blue-600 bg-white border border-blue-600 rounded-md group hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
>
  <span className="absolute inset-0 transition-all duration-100 ease-linear group-hover:bg-blue-600 rounded-md"></span>
  <span className="relative">
    Sign Up
  </span>
</button>

            </form>
            
            <p className='text-sm text-center font-bold mt-6'>Already have an account? <Link to={'/login'} className='text-blue-500 underline'>Login</Link></p>
        </div>
    </div>
</Fragment>

  )
}

export default AuthPage