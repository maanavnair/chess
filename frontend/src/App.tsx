import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './screens/Landing'
import Game from './screens/Game'
import Login from './screens/Login'
import Signup from './screens/Signup'

const App = () => {
  return (
    <div className='h-screen bg-slate-950'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/game' element={<Game />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default App