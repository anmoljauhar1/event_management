import { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, logoutUser, getProfile } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists in localStorage and fetch profile
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getProfile()
        .then((data) => setUser(data))
        .catch(() => {
          // If token is invalid, clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    // Fetch user profile after login
    const profile = await getProfile();
    setUser(profile);
    return profile;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    // After registration, we also have user data; we can either set it from response
    // or fetch profile. For simplicity, we'll call getProfile to get full profile data.
    const profile = await getProfile();
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        await logoutUser(refresh);
      } catch (err) {
        console.error('Logout failed', err);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = (profileData) => {
    setUser(profileData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};