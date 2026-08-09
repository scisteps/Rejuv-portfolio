// src/components/Auth/AuthPopup.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '../../Firebase';
import { upsertUserProfile } from './Firestoreservice';
import './AuthPopup.css';

// Default country code shown in the phone field — change to whatever fits
// your primary user base, or swap this for a real country-code dropdown.
const DEFAULT_COUNTRY_CODE = '+256';

// Basic E.164 check: + followed by 8–15 digits total.
const E164_REGEX = /^\+[1-9]\d{7,14}$/;

const AuthPopup = ({ isOpen, onClose, onSuccess }) => {
  // step: 'login' -> enter credentials, 'phone' -> enter number, 'otp' -> enter code from SMS, 'signup' -> create account
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_COUNTRY_CODE);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSignup, setIsSignup] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  // Reset everything when the modal closes so it starts fresh next time.
  useEffect(() => {
    if (!isOpen) {
      setStep('login');
      setEmail('');
      setPassword('');
      setName('');
      setDateOfBirth('');
      setPhoneNumber(DEFAULT_COUNTRY_CODE);
      setOtp('');
      setConfirmationResult(null);
      setError('');
      setLoading(false);
      setIsSignup(false);
      setUsePhone(false);
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    }
  }, [isOpen]);

  // Simple countdown for the "Resend code" button.
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const getRecaptchaVerifier = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
      });
    }
    return recaptchaVerifierRef.current;
  };

  // ── Email/Password Signup ──
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await upsertUserProfile(user.uid, {
        email: email,
        displayName: name,
        photoURL: '',
        dateOfBirth: dateOfBirth,
        // Additional fields from your signup function
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalScore: 0,
        totalfailed: 0,
        comments: null,
        selection: null,
        // Subject stats would be initialized separately
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Email signup error:', err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please sign in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Phone Signup (with SMS verification) ──
  const handlePhoneSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    const cleaned = phoneNumber.trim().replace(/[\s-]/g, '');
    if (!E164_REGEX.test(cleaned)) {
      setError('Enter a valid phone number with country code, e.g. +256701234567');
      return;
    }

    setLoading(true);
    try {
      const verifier = getRecaptchaVerifier();
      const result = await signInWithPhoneNumber(auth, cleaned, verifier);
      setConfirmationResult(result);
      setStep('otp');
      setResendCooldown(30);
    } catch (err) {
      console.error('Send code error:', err);
      switch (err.code) {
        case 'auth/invalid-phone-number':
          setError('That phone number looks invalid. Check the format and try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please wait a bit and try again.');
          break;
        case 'auth/operation-not-allowed':
          setError('Phone sign-in is not enabled for this project yet.');
          break;
        default:
          setError('Failed to send verification code. Please try again.');
      }
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP and complete signup ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the 6-digit code we sent you');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp.trim());
      
      // Create user profile for phone signup
      await upsertUserProfile(result.user.uid, {
        phoneNumber: result.user.phoneNumber,
        displayName: name || result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        dateOfBirth: dateOfBirth,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalScore: 0,
        totalfailed: 0,
        comments: null,
        selection: null,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Verify code error:', err);
      switch (err.code) {
        case 'auth/invalid-verification-code':
          setError('That code is incorrect. Double-check and try again.');
          break;
        case 'auth/code-expired':
          setError('That code expired. Request a new one.');
          break;
        default:
          setError('Failed to verify code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Login with Email/Password ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Login error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up first.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setStep('phone');
    setOtp('');
    setConfirmationResult(null);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setDateOfBirth('');
    setPhoneNumber(DEFAULT_COUNTRY_CODE);
    setStep('login');
    setUsePhone(false);
  };

  // ── Google Sign-in ──
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await upsertUserProfile(result.user.uid, {
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in cancelled');
      } else {
        setError('Failed to login with Google');
      }
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
          <h2>
            {step === 'otp' 
              ? 'Enter Verification Code' 
              : isSignup 
                ? 'Create Account' 
                : 'Sign In'}
          </h2>
          <p>
            {step === 'otp'
              ? `Sent to ${phoneNumber}`
              : isSignup
                ? 'Join us and start learning!'
                : 'Welcome back!'}
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* ── Signup Form ── */}
        {isSignup && step === 'login' && !usePhone && (
          <form onSubmit={handleEmailSignup}>
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Password (8+ characters)</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                  minLength="8"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="auth-phone-toggle"
              onClick={() => setUsePhone(true)}
              disabled={loading}
            >
              📱 Sign up with Phone Number
            </button>
          </form>
        )}

        {/* ── Phone Signup Form ── */}
        {isSignup && step === 'login' && usePhone && (
          <form onSubmit={handlePhoneSignup}>
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+256701234567"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Sending code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </button>

            <button
              type="button"
              className="auth-phone-toggle"
              onClick={() => setUsePhone(false)}
              disabled={loading}
            >
              ← Back to Email Signup
            </button>
          </form>
        )}

        {/* ── Login Form ── */}
        {!isSignup && step === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        {/* ── OTP Verification ── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <div className="auth-field">
              <label>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify & Complete Signup'
              )}
            </button>

            <div className="auth-footer">
              <button
                className="auth-switch"
                onClick={handleResend}
                disabled={loading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : '← Resend code'}
              </button>
            </div>
          </form>
        )}

        {/* Invisible reCAPTCHA anchor — required by signInWithPhoneNumber */}
        <div ref={recaptchaContainerRef} id="recaptcha-container"></div>

        {/* ── Google Sign-in (both login and signup) ── */}
        {step !== 'otp' && (
          <>
            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <button className="auth-google" onClick={handleGoogleLogin} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.08-.84 2-1.8 2.62v2.18h2.92c1.7-1.56 2.68-3.86 2.68-6.44z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.18c-.81.54-1.86.86-3.04.86-2.34 0-4.33-1.58-5.04-3.7H1.09v2.16C2.58 15.8 5.56 18 9 18z" fill="#34A853"/>
                <path d="M3.96 10.8c-.18-.54-.28-1.1-.28-1.68s.1-1.14.28-1.68V5.28H1.09C.39 6.48 0 7.94 0 9.52s.39 3.04 1.09 4.24l2.87-2.96z" fill="#FBBC05"/>
                <path d="M9 3.52c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.47.98 11.43 0 9 0 5.56 0 2.58 2.2 1.09 5.28l2.87 2.16C4.67 5.1 6.66 3.52 9 3.52z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {/* ── Toggle between Login and Signup ── */}
        {step !== 'otp' && (
          <div className="auth-toggle">
            <button onClick={toggleMode} disabled={loading}>
              {isSignup 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPopup;