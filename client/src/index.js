import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotifProvider } from './context/NotifContext';
import { MessagingProvider } from './context/MessagingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <NotifProvider>
      <AuthProvider>
        <MessagingProvider>
          <App />
        </MessagingProvider>
      </AuthProvider>
    </NotifProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
