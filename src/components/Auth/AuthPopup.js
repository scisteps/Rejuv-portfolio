// src/components/Auth/AuthPopup.jsx
import React, { useState } from 'react';
import { auth } from '../../Firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import './AuthPopup.css';

const AuthPopup = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Try again later.');
          break;
        default:
          setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Signup error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setError('');
      alert('Password reset email sent! Check your inbox.');
      setResetMode(false);
    } catch (error) {
      console.error('Reset error:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>

        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2>{resetMode ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{resetMode ? 'Enter your email to reset your password' : isLogin ? 'Sign in to continue' : 'Join the community'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={resetMode ? handleResetPassword : isLogin ? handleLogin : handleSignup}>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          {!resetMode && (
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength="6"
              />
            </div>
          )}

          {!isLogin && !resetMode && (
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="auth-spinner"></span>
                Loading...
              </>
            ) : resetMode ? (
              'Send Reset Email'
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Google Login Button */}
        {!resetMode && (
          <button
            className="auth-google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.08-.84 2-1.8 2.62v2.18h2.92c1.7-1.56 2.68-3.86 2.68-6.44z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.18c-.81.54-1.86.86-3.04.86-2.34 0-4.33-1.58-5.04-3.7H1.09v2.16C2.58 15.8 5.56 18 9 18z" fill="#34A853"/>
              <path d="M3.96 10.8c-.18-.54-.28-1.1-.28-1.68s.1-1.14.28-1.68V5.28H1.09C.39 6.48 0 7.94 0 9.52s.39 3.04 1.09 4.24l2.87-2.96z" fill="#FBBC05"/>
              <path d="M9 3.52c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.47.98 11.43 0 9 0 5.56 0 2.58 2.2 1.09 5.28l2.87 2.16C4.67 5.1 6.66 3.52 9 3.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        )}

        <div className="auth-footer">
          {resetMode ? (
            <button
              className="auth-switch"
              onClick={() => setResetMode(false)}
              disabled={loading}
            >
              ← Back to login
            </button>
          ) : isLogin ? (
            <>
              <button
                className="auth-switch"
                onClick={() => setResetMode(true)}
                disabled={loading}
              >
                Forgot password?
              </button>
              <span className="auth-divider">|</span>
              <button
                className="auth-switch"
                onClick={() => setIsLogin(false)}
                disabled={loading}
              >
                Create account
              </button>
            </>
          ) : (
            <button
              className="auth-switch"
              onClick={() => setIsLogin(true)}
              disabled={loading}
            >
              ← Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;