// src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm'; // NEW: Import LoginForm
import RegisterForm from './RegisterForm'; // NEW: Import RegisterForm
import './AuthModal.scss'; // NEW: SCSS for AuthModal

const AuthModal = ({ onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true); // true for login, false for register

  const handleModalContentClick = (e) => {
    e.stopPropagation(); // Prevent modal from closing when clicking inside
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          <h2 className="modal-title">{isLoginView ? 'Login' : 'Register'}</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {isLoginView ? (
            <LoginForm onClose={onClose} onSwitchToRegister={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm onClose={onClose} onSwitchToLogin={() => setIsLoginView(true)} />
          )}
        </div>
        <div className="auth-switch-prompt">
            {isLoginView ? (
                <p>Don't have an account? <span onClick={() => setIsLoginView(false)}>Register here.</span></p>
            ) : (
                <p>Already have an account? <span onClick={() => setIsLoginView(true)}>Login here.</span></p>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;