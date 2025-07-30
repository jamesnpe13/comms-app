import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { MessagingProvider } from './context/MessagingContext';
import Modal from './components/ui/Modal';
import Toast from './components/ui/Toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toast>
      <MessagingProvider>
        <BrowserRouter>
          <AuthProvider>
            <Modal>
              <App />
            </Modal>
          </AuthProvider>
        </BrowserRouter>
      </MessagingProvider>
    </Toast>
  </React.StrictMode>
);
