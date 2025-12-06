import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

const container = document.getElementById('root')!
const root = createRoot(container)
const clientId = "46394625832-qho65a959pk45t30hc413ufirv4lutma.apps.googleusercontent.com";

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
)
