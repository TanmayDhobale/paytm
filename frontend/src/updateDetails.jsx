import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userAuth } from './atoms'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useState } from 'react'
const UpdateDetails = () => {
    const  [value, setValue] = useRecoilState(userAuth)
    const [ID, setID] = useState('')
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastName] = useState('')
    const navigate = useNavigate()
    const signOutHandler = ()=>{
        localStorage.removeItem('authToken')
        setValue(false)
        toast("Signed Out successfully")
        navigate('/login')
    }
    const updateUserDetail = async()=>{
    const authToken = localStorage.getItem('authToken')
  const authAxios = axios.create({
    headers:{
      authorization: `Bearer ${authToken} `
    }
  })
    const { data }= await authAxios.get(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/fetchDetails`)
    console.log(data)
        if(data.success){
            setID(data.user.username)
                
        }
   
    }
    const updateIt=async()=>{
        const authToken = localStorage.getItem('authToken')
        const authAxios = axios.create({
          headers:{
            authorization: `Bearer ${authToken} `
          }
        })
        const { data:updatedUser }= await authAxios.put(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/updateInfo`,{
            username:ID, firstName:firstName , lastName:lastName
        })
        if(updatedUser.success){
            toast('Update User Successfully')
            navigate('/Dashboard')
        }
    }
    useEffect(()=>{
        if(value===false){
          navigate('/login')
        }
        updateIt()
        } ,[ID])

  return (
    <div>
        <div className='underline m-3' > <Link to={'/Dashboard'} > back</Link> </div>
        <div className='border-slate-600 border h-[70vh] w-[35vw] pt-3 rounded-lg flex flex-col justify-center m-auto '  >
                <div className='text-2xl text-center font-bold' >Update User Info</div>
                <div> </div>
                <div className='m-auto' >
                    <label className='font-bold' htmlFor="">First Name</label> <br></br>
                    <input onChange={(e)=>setFirstname(e.target.value)} type="text" className='border border-slate-600 px-2 py-2 '  placeholder='Enter First Name' />
                </div>
                <div  className='m-auto' >
                    <label className='font-bold' htmlFor="">Last Name</label> <br></br>
                    <input onChange={(e)=>setLastName(e.target.value)} className='border border-slate-600 px-2 py-2 '  placeholder='Enter last Name' type="text" />
                </div>
                <div  className='m-auto' > 
                    <button onClick={updateUserDetail} className='bg-green-600 text-white px-4 py-2 text-sm font-bold rounded-md ' > Update User Info</button>
                </div>
                <div  className='m-auto' > 
                    <button onClick={signOutHandler} className='bg-red-600 text-white px-4 py-2 text-sm font-bold rounded-md' >Sign Out</button>
                </div>
        </div>
    </div>
  )
}

export default UpdateDetails