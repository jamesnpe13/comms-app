import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { MessagingProvider } from './context/MessagingContext';
import { SocketProvider } from './context/SocketContext';
import ModalProvider from './components/ui/Modal';
import ToastProvider from './components/ui/Toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <SocketProvider>
        <MessagingProvider>
          <BrowserRouter>
            <AuthProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </AuthProvider>
          </BrowserRouter>
        </MessagingProvider>
      </SocketProvider>
    </ToastProvider>
  </React.StrictMode>
);
