import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'Aa123456') {
      // Successful login
      if (rememberMe) {
        // Implement remember me functionality here
        // For example, you could store a token in localStorage
        localStorage.setItem('isLoggedIn', 'true');
      }
      // Redirect to HomePage
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }

    // e.preventDefault();

    // const data = JSON.stringify({
    //   "collection": "yourCollectionName",
    //   "database": "yourDatabaseName",
    //   "dataSource": "migdalor",
    //   "filter": { "username": username },
    //   "projection": { "_id": 1, "username": 1, "password": 1 }
    // });

    // const config = {
    //   method: 'post',
    //   url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-hkqpcmv/endpoint/data/v1/action/findOne',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Request-Headers': '*',
    //     'Authorization': 'Bearer <ACCESS_TOKEN>', // Replace <ACCESS_TOKEN> with your actual access token
    //   },
    //   data: data
    // };

    // try {
    //   const response = await axios(config);
    //   const user = response.data.document;

    //   if (user && user.password === password) {
    //     setSuccess('Login successful');
    //     setError('');
    //   } else {
    //     setError('Invalid username or password');
    //     setSuccess('');
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setError('An error occurred during login');
    //   setSuccess('');
    // }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-cover bg-center" style={{ backgroundImage: `url('/background.png')` }}></div>
      <div className="flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">התחברות</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
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
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:bg-green-700"
            >
              התחברות
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;