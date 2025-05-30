import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';

const clientId = "215959146466-o1hkq5oqqs2aumbimo2tcg7leufqhhim.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </UserProvider>
);
