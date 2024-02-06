import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './AuthPage'
import Login from './Login'
import Dashboard from './Dashboard'
import TransferMoney from './TransferMoney'
import { Toaster } from 'react-hot-toast';
import UpdateDetails from './updateDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AuthPage/>}  ></Route>
        <Route path='/login' element={<Login />}  ></Route>
        <Route path='/Dashboard' element={<Dashboard />}  ></Route>
        <Route path='/transferFunds/:id' element={<TransferMoney />}  ></Route>
        <Route path='/updateUserDetails' element={<UpdateDetails />}  ></Route>
      </Routes>
      <Toaster/>
  </Router>
  ) 
}

export default App
