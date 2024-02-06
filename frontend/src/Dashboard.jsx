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
    <div>
        <div className='flex justify-between ' >
          <div className='font-bold mt-3 ml-3 ' >Wallet App</div>
          <hr></hr>
          <div className='flex gap-4 mr-3 mt-3' >
            <div className='font-semibold' >Hello,{Details.firstName}</div>
            <div className=''  > <img src="/letter-u.png" className='w-[25px] border-slate-700 hover:cursor-pointer border-[0.1px] rounded-[50%] p-1' onClick={()=> navigate('/updateUserDetails')} alt="" /> </div>
          </div>
        </div>
      <div className='flex gap-3 mt-3 ml-3 font-bold' >
        <div>Your Balance </div>
        <div>₹{accountDetails.balance}</div>
      </div>
      <div className='mt-3 ml-3' >
          <div>
            <input type="text" placeholder='Search Users' className='border-slate-700 rounded-md border w-[70%] py-1 px-2 ' onChange={(e)=>setfilter(e.target.value)} />
          </div>  
          {
            filteredUser && filteredUser.map((users)=>(
            <div key={users._id} className='flex justify-between mt-3' >
              <div className='flex ml-3 gap-3' >
                <div><img src="/letter-u.png" className='w-[25px] border-slate-700 border-[0.1px] rounded-[50%] p-1' alt="" /></div>
                <div className='font-bold' > {users.firstName} {users.lastName}  </div>
              </div>
                <div className='mr-3' > <button onClick={()=>sendMoneyHandler(users._id)} className='bg-black text-white p-1.5 px-2 font-semibold rounded-sm text-sm'>Send Money</button></div>
            </div>
            ))
          }
      </div>

    </div>
  )
}

export default Dashboard