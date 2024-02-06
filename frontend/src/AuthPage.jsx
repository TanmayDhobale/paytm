import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { userAuth } from './atoms'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import toast from 'react-hot-toast'
// import.meta.env.VITE_URL
const AuthPage = () => {
  const url = import.meta.env.VITE_URL ?? "http://localhost:5000"
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
        <div className='h-screen w-screen text-black font-sans font-medium pt-6 bg-neutral-600 ' >
            <div className=' bg-white w-[29vw] m-auto flex flex-col gap-2 pt-6 min-w-[340px]  border-2 rounded-lg '  > 
            <div className='text-3xl font-bold text-center '  >
                <h3>Sign Up</h3>
            </div>
            <div className=' w-[70%] m-auto text-center text-slate-500 text-sm ' >
              Enter your information to create an account
            </div>
            <div className='m-auto w-[80%] ' > 
              <div>  
              <label htmlFor="FirstName" className='font-bold' >First Name</label>
              </div>
              <input className='p-2 text-black w-[100%] mt-2' value={firstName} onChange={(e)=>setfirstName(e.target.value)} type="text" placeholder='firstname' />
            </div>
            <div className=' w-[80%] m-auto ' >
              <div>
              <label htmlFor="lastname" className='font-bold' >Last Name</label>
              </div>
              <input  className='p-2 text-black w-[100%] mt-2 'value={lastName} onChange={(e)=>setlastName(e.target.value)}type="text" placeholder='lastname' />
            </div>
            <div  className=' w-[80%] m-auto ' >
              <div>
              <label htmlFor="Email" className='font-bold' >Email</label>
              </div>
              <input  className='p-2 text-black w-[100%] mt-2 ' value={Email} onChange={(e)=>setEmail(e.target.value)}  type="text" placeholder='Email' />
            </div>
            <div className=' w-[80%] m-auto ' >
              <div>
              <label htmlFor="password" className='font-bold' >Password</label>
              </div>
              <input  className='p-2 text-black w-[100%] mt-2 ' value={password}  onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='password' />
            </div>
            <div className='mt-4 mb-4  m-auto w-[100%]' >
              <button className=' py-2 border-black border rounded-md text-center w-[80%] flex justify-center m-auto bg-black text-white ' onClick={signUpHandler} >Sign up</button>
              <div className='text-sm mt-3 text-pretty text-center font-bold ' >Already have an account? <Link to={'/login'} className='underline' >Login</Link> </div>
            </div>
            </div>
        </div>
    </Fragment>
  )
}

export default AuthPage