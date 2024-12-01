import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext.tsx'
import { GameContextProvider } from './context/GameContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <GameContextProvider>
          <App />
        </GameContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
