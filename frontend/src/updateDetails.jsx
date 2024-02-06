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
<div className="min-h-screen bg-gray-100 flex flex-col justify-center">
  <div className='underline m-3 text-right mr-10'>
    <Link to={'/Dashboard'} className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">Back</Link>
  </div>
  <div className='bg-white shadow-xl border border-gray-200 h-[30vw] w-[70vw] pt-6 pb-8 rounded-lg flex flex-col justify-center m-auto space-y-5'>
    <div className='text-3xl text-center font-bold text-gray-800'>Update User Info</div>
    <div className='px-10'>
      <div className='mb-4'>
        <label className='block font-bold mb-2 text-gray-700' htmlFor="firstName">First Name</label>
        <input onChange={(e) => setFirstname(e.target.value)} type="text" className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='Enter First Name' />
      </div>
      <div className='mb-6'>
        <label className='block font-bold mb-2 text-gray-700' htmlFor="lastName">Last Name</label>
        <input onChange={(e) => setLastName(e.target.value)} type="text" className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='Enter Last Name' />
      </div>
      <div className='flex justify-between items-center'>
        <button onClick={updateUserDetail} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out'>Update User Info</button>
        <button onClick={signOutHandler} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out'>Sign Out</button>
      </div>
    </div>
  </div>
</div>


  )
}

export default UpdateDetails