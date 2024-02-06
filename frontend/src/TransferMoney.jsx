import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const TransferMoney = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const pathname = location.pathname;
  const updated = pathname.split('/')[2]
  const [accountDetails, setAccountDetails] = useState('')
  const [TOaccountDetails, setToAccountDetails] = useState('')
  const [Amount, setAmount] = useState('')
  const authToken = localStorage.getItem('authToken')
  const authAxios = axios.create({
    headers:{
      authorization: `Bearer ${authToken} `
    }
  })

  const fetchDetails = async()=>{
    const { data } = await authAxios.get(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/fetchDetails`);
    if(data.success){
      setAccountDetails(data.user)
    }
    const { data:userDetails } = await authAxios.post(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/fetchAnyUser`,{
      userID:updated
    });
    if(userDetails.success){
     setToAccountDetails(userDetails.user)
     console.log(TOaccountDetails)
    }
  }

  const TransferFunds = async()=>{
    const { data } = await authAxios.post(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/getAccountBalance`,{
      userID:accountDetails._id
    })
    if(data.success){
      if(data.account.balance < Amount){
        toast("Unsufficient Balance")
      } else {
        const { data:transferFunds } = await authAxios.post(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/transferFunds`,{
            amount:Number(Amount), to:updated
          });
          if(transferFunds.success){
            toast(transferFunds.message)
            navigate('/Dashboard')
          } else {
            toast("Something went wrong")
          }
        }
    } else {

    }

  }

  useEffect(()=>{
    fetchDetails()
  },[])

  return (
    <div className='w-screen h-screen' >
      <div className='m-4 underline '>
        <Link to={'/Dashboard'} > back </Link>
      </div>
      <div className='flex flex-col gap-4 m-auto min-w-[300px]  max-w-[30vw] h-[40vh] border border-slate-500 items-center mt-14 ' >
        <div className='font-bold text-2xl mt-3' >Send Money</div>
        <div>
          <div className='flex min-w-[25vw] gap-3  '>
            <div >  
            </div> 
            <img src="/letter-u.png" className='w-[25px] border-slate-700 border-[0.1px] rounded-[50%] p-1' alt="" />
            </div>
            <div className='font-bold text-xl ' >
              {TOaccountDetails.firstName} 
            </div>
            <div className='flex flex-col  gap-1 mt-3 ' >
                <label className='font-semibold text-sm ' htmlFor="">Amount (in ₹)</label>
                <input type="text" className=' py-1 px-3 border-slate-400 rounded-md border' onChange={(e)=>setAmount(e.target.value)} placeholder='Enter Amount' />
            </div>
            <div className='mt-3' >
              <button className='bg-green-600 text-white w-[100%]  py-1 text-sm font-semibold ' onClick={TransferFunds} >Initiate Transfer</button>
            </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default TransferMoney