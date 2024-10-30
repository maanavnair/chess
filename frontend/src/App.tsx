import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './screens/Landing'
import Game from './screens/Game'

const App = () => {
  return (
    <div className='h-screen bg-slate-900'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </div>
  )
}

export default App