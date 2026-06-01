import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleChoice, setRoleChoice] = useState('user');
  const [error, setError] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const profile = await login({ username, password });
      if (profile.role !== roleChoice) {
        await logout();
        setError(`This account is registered as ${profile.role === 'admin' ? 'Event Host' : 'Attendee'}. Please switch!`);
        return;
      }
      navigate('/profile');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>

        {/* Switch toggle button */}
        <div className="flex justify-center mt-6">
          <div className="bg-gray-100 p-1.5 rounded-full inline-flex space-x-1 border border-gray-200 shadow-inner">
            <button
              type="button"
              onClick={() => setRoleChoice('user')}
              className={`px-6 py-2 rounded-full text-xs font-black transition-all ${
                roleChoice === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Attendee Login
            </button>
            <button
              type="button"
              onClick={() => setRoleChoice('admin')}
              className={`px-6 py-2 rounded-full text-xs font-black transition-all ${
                roleChoice === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Event Host Login
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl text-xs font-bold border border-red-100 mt-4 leading-relaxed">{error}</div>}
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="rounded-md shadow-sm space-y-2">
            <input type="text" required placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium" />
          </div>
          <button type="submit" className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-extrabold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">
            Sign In
          </button>
        </form>
        <div className="text-center pt-2">
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 text-sm">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;