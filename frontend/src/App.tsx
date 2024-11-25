import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Landing from './screens/Landing'
import Game from './screens/Game'
import Login from './screens/Login'
import Signup from './screens/Signup'
import { Toaster } from 'react-hot-toast'
import { useContext, useEffect } from 'react'
import { UserContext } from './context/UserContext'

const App = () => {

  const { user, setUser } = useContext(UserContext);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Fetched user data:', data);
        if (data.userProfile) {
          setUser(data.userProfile);
        } else {
          console.log('No userProfile in response.');
          setUser(null);
        }
      } else {
        console.log('Response not ok:', res);
        setUser(null);
      }
    }
    catch (error) {
      console.log("Error fetching details: ", error);
    }
  }

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [])

  return (
    <div className='h-screen bg-slate-950'>
      <Routes>
        <Route path='/' element={user ? <Navigate to='/game' /> : <Landing />} />
        <Route path='/game' element={user ? <Game /> : <Navigate to='/login' />} />
        <Route path='/signup' element={user ? <Navigate to='/game' /> : <Signup />} />
        <Route path='/login' element={user ? <Navigate to='/game' /> : <Login />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App