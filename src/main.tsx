import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LucidProvider } from './context/LucidProvider.tsx'
import { PlutusProvider } from './context/PlutusProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LucidProvider>
      <PlutusProvider>
        <App />
      </PlutusProvider>
    </LucidProvider>
  </StrictMode>,
)
