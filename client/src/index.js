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
  <MessagingProvider>
    <BrowserRouter>
      <NotifProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotifProvider>
    </BrowserRouter>
  </MessagingProvider>
  // </React.StrictMode>
);
