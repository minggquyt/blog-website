import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './components/Header/Header.tsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
