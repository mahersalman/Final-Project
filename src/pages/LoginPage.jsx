import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5001/api/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username) {
      setError('Please enter your username');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/forgot-password', { username });
      setSuccess(response.data.message);
      setIsResettingPassword(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5001/api/reset-password', { username, newPassword });
      setSuccess(response.data.message);
      setIsResettingPassword(false);
      setNewPassword('');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url('/loginPic.jpg')` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 max-w-md w-full mx-auto p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">התחברות</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {!isResettingPassword ? (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-4 w-full">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2 text-center">שם משתמש</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="הכנס את שם המשתמש שלך"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6 w-full">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 text-center">סיסמה</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הכנס את הסיסמה שלך"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:bg-green-700 mb-4"
            >
              התחברות
            </button>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-500 hover:text-blue-700"
            >
              שכחת סיסמה?
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col items-center">
            <div className="mb-4 w-full">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2 text-center">סיסמה חדשה</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="הכנס סיסמה חדשה"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:bg-green-700 mb-4"
            >
              אפס סיסמה
            </button>
            <button
              type="button"
              onClick={() => setIsResettingPassword(false)}
              className="text-blue-500 hover:text-blue-700"
            >
              חזור להתחברות
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;