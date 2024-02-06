import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userAuth } from './atoms'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

const Dashboard = () => {
    const navigate = useNavigate()
    const userLogin = useRecoilValue(userAuth)
    const [Details, setDetails] = useState('')
    const [accountDetails, setAccountDetails] = useState('')
    const [bulkUsers, setBulkData] = useState('')
    const [filter, setfilter] = useState('')
    const sendMoneyHandler = (id)=>{
    navigate(`/transferFunds/${id}`)
    }
  const authToken = localStorage.getItem('authToken')
  const authAxios = axios.create({
    headers:{
      authorization: `Bearer ${authToken} `
    }
  })
  const fetchUserDetails = async () => {
    try {
      const { data } = await authAxios.get(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/fetchDetails`);
  
      if (data.success) {
        setDetails(data.user);
  
        const userID = data.user._id;
        const { data: accountData } = await authAxios.post(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/getAccountBalance`, {
          userID
        });
  
        if (accountData.success) {
          setAccountDetails(accountData.account);
        } else {
          toast("Something went wrong");
        }
      } else {
        toast("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast("Something went wrong");
    }
  };
 const fetchUsers = async()=>{
    const { data: bulkData } = await axios.post(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/bulk`, {
      filter:filter
    });

    if (bulkData.success) {
      setBulkData(bulkData.users);
    } else {
      toast("Something went wrong");
    }
 }
const filteredUser = bulkUsers&& bulkUsers.filter(user=> user._id !==Details._id)

  useEffect(()=>{
    if(userLogin===false){
      navigate('/login')
    }
    fetchUserDetails()
  },[userLogin,axios])
  useEffect(() => {
    fetchUsers()
  }, [filter]);
  return (
<div className="min-h-screen bg-gray-100">
  <div className="bg-white shadow p-4">
    <div className='flex justify-between items-center'>
      <div className='text-xl font-bold text-gray-800'>Wallet App</div>
      <div className='flex items-center gap-4'>
        <div className='font-semibold text-gray-700'>Hello, {Details.firstName}</div>
        <img src="/letter-u.png" className='w-8 h-8 rounded-full border border-gray-300 cursor-pointer p-1' onClick={() => navigate('/updateUserDetails')} alt="" />
      </div>
    </div>
  </div>

  <div className='p-4'>
    <div className='bg-white shadow rounded-lg p-4'>
      <div className='text-lg font-bold'>Your Balance</div>
      <div className='text-xl text-green-600'>₹{accountDetails.balance}</div>
    </div>

    <div className='mt-4'>
      <input type="text" placeholder='Search Users' className='w-full border border-gray-300 rounded-md py-2 px-4 focus:ring-blue-500 focus:border-blue-500' onChange={(e) => setfilter(e.target.value)} />
    </div>

    {filteredUser && filteredUser.map((users) => (
      <div key={users._id} className='flex justify-between items-center mt-3 bg-white shadow rounded-lg p-3'>
        <div className='flex gap-3 items-center'>
          <img src="/letter-u.png" className='w-10 h-10 rounded-full border border-gray-300' alt="" />
          <div className='text-sm font-bold'>{users.firstName} {users.lastName}</div>
        </div>
        <button onClick={() => sendMoneyHandler(users._id)} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold'>Send Money</button>
      </div>
    ))}
  </div>
</div>

  )
}

export default Dashboard