'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    let newError = {};
    if (!email || !email.trim()) newError.email = 'Email is required';
    if (!password || !password.trim())
      newError.password = 'Password is required';

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      });
      setLoading(false);
      const data = await response.json();
      if (!response.ok) {
        setError({ login: data.error });
        return;
      }

      router.push('/');
    } catch (error) {
      console.log('Error Logging in.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && (
            <span className="text-sm text-red-500">{error.email}</span>
          )}

          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <span className="text-sm text-red-500">{error.password}</span>
          )}
        </div>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push('/signup')}
          >
            Signup
          </span>
        </p>

        <button
          className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in ...' : 'Login'}
        </button>

        {error.login && (
          <span className="block text-center text-sm text-red-500 mt-4">
            {error.login}
          </span>
        )}
      </div>
    </div>
  );
};

export default Login;
