import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      navigate('/profile');
    } catch (err) {
      if (err.response?.data) {
        // Format DRF validation errors
        const messages = Object.values(err.response.data).flat().join(' ');
        setError(messages);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            <input name="username" type="text" required placeholder="Username" value={formData.username} onChange={handleChange} className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            <input name="email" type="email" required placeholder="Email address" value={formData.email} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            <div className="grid grid-cols-2 gap-2">
              <input name="first_name" type="text" placeholder="First name" value={formData.first_name} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              <input name="last_name" type="text" placeholder="Last name" value={formData.last_name} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <input name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            <input name="password2" type="password" required placeholder="Confirm password" value={formData.password2} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Register As</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'user' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  formData.role === 'user'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className="font-extrabold text-sm flex items-center justify-between">
                  <span>Attendee</span>
                  {formData.role === 'user' && <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">Explore, visit & join events and clubs.</p>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  formData.role === 'admin'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className="font-extrabold text-sm flex items-center justify-between">
                  <span>Event Host</span>
                  {formData.role === 'admin' && <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">Host/manage public & private events.</p>
              </button>
            </div>
          </div>

          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Sign Up
          </button>
        </form>
        <div className="text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;