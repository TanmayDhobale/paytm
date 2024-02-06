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
   <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="max-w-sm mx-auto bg-white rounded-lg shadow overflow-hidden">
    <div className="px-4 py-5 sm:p-6">
      <div className="mb-2 text-lg font-semibold text-gray-900">Send Money</div>
      <div className="flex items-center mb-3">
        <img src="/letter-u.png" alt="" className="w-10 h-10 rounded-full border-2 border-gray-300 mr-3"/>
        <h2 className="text-md font-medium text-gray-700">{TOaccountDetails.firstName}</h2>
      </div>
      <form>
        <div className="mb-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (in ₹)</label>
          <input 
            type="text" 
            id="amount" 
            className="mt-1 block w-full border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
          />
        </div>
        <div className="mt-2">
          <button 
            type="button" 
            onClick={TransferFunds}
            className="inline-flex justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm focus:outline-none focus:shadow-outline"
          >
            Initiate Transfer
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  )
}

export default TransferMoney