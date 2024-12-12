import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ContactProvider } from './contexts/ContactContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID' // Replace with your actual Google Client ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <ContactProvider>
            <App />
            <ToastContainer position="bottom-right" />
          </ContactProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)