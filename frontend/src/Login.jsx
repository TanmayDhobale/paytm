import React, { Fragment, useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userAuth } from './atoms'

const AuthPage = () => {
const url = import.meta.env.VITE_URL ?? "http://localhost:5000"
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
        <div className='h-screen w-screen text-black font-sans font-medium pt-6 bg-neutral-600 ' >
            <div className=' bg-white w-[29vw] m-auto flex flex-col gap-2 pt-6 min-w-[300px] mt-20 border-2 rounded-lg '  > 
            <div className='text-3xl font-bold text-center '  >
                <h3>Sign In</h3>
            </div>
            <div className=' w-[70%] m-auto text-center text-slate-500 text-md ' >
              Enter your credentials to access your account
            </div>        

            <div  className=' w-[80%] m-auto ' >
              <div>
              <label htmlFor="Email" className='font-bold' >Email</label>
              </div>
              <input
               value={Email} required={true}
                onChange={(e)=>setEmail(e.target.value)}  className='p-2 text-black w-[100%] mt-2 '  type="text" placeholder='Email' />
            </div>
            <div className=' w-[80%] m-auto ' >
              <div>
              <label htmlFor="password" className='font-bold' >Password</label>
              </div>
              <input required={true}  value={password} onChange={(e)=>setPassword(e.target.value)} className='p-2 text-black w-[100%] mt-2 '  type="password" placeholder='password' />
            </div>
            <div className='mt-4 mb-4  m-auto w-[100%]' >
              <button className=' py-2 border-black border rounded-md text-center w-[80%] flex justify-center m-auto bg-black text-white ' onClick={signInHandler} >Sign In</button>
              <div className='text-sm mt-3 text-pretty text-center font-bold ' >Don't have an account? <Link to={'/'} className='underline' >Signin</Link> </div>
            </div>
            </div>
        </div>
    </Fragment>
  )
}

export default AuthPage