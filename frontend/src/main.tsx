import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext.tsx'
import { GameContextProvider } from './context/GameContext.tsx'
import SocketProvider from './context/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <SocketProvider>
          <GameContextProvider>
            <App />
          </GameContextProvider>
        </SocketProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
