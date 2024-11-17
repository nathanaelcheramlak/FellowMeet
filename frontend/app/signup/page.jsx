'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const router = useRouter();

  const validateForm = () => {
    let newError = {};
    if (!fullName || !fullName.trim()) newError.fullName = 'Name is required';
    if (!email || !email.trim()) newError.email = 'Email is required';
    if (!password || !password.trim())
      newError.password = 'Password is required';
    if (password !== confirmPass) newError.match = "Password doesn't match";

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/signup`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword: confirmPass,
        }),
        credentials: 'include',
      });
      setLoading(false);
      const data = await response.json();
      if (!response.ok) {
        setError({ login: data.error });
        return;
      }

      router.push('/more-info');
    } catch (error) {
      console.log('Error Signing up.', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Signup
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={fullName}
            placeholder="Fullname"
            onChange={(e) => setFullname(e.target.value)}
          />
          {error.fullName && (
            <span className="text-sm text-red-500">{error.fullName}</span>
          )}

          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && (
            <span className="text-sm text-red-500">{error.email}</span>
          )}

          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <span className="text-sm text-red-500">{error.password}</span>
          )}

          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={confirmPass}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          {error.match && (
            <span className="text-sm text-red-500">{error.match}</span>
          )}
        </div>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push('/login')}
          >
            Log in
          </span>
        </p>

        <button
          className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Signing up ...' : 'Signup'}
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

export default Signup;
