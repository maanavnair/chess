import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './screens/Landing'
import Game from './screens/Game'
import Login from './screens/Login'
import Signup from './screens/Signup'
import { Toaster } from 'react-hot-toast'
import { useContext, useEffect } from 'react'
import { UserContext } from './context/UserContext'
import ChessGame from './screens/ChessGame'

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
        <Route path='/' element={<Landing />} />
        <Route path='/game' element={<Game />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/match' element={<ChessGame />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App