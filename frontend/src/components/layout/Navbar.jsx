import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[color:var(--surface-glass)] backdrop-blur-md sticky top-0 z-50 border-b border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-black text-[color:var(--primary)] tracking-tight flex items-center"
            >
              <span className="bg-[color:var(--primary)] text-[color:var(--text-primary)] p-1 rounded mr-2 h-8 w-8 flex items-center justify-center">E</span>
              EventPro
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/events" className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary)] font-medium transition-colors">Events</Link>
              <Link to="/events/trending" className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary)] font-medium transition-colors">Trending</Link>
              <Link to="/halls" className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary)] font-medium transition-colors">Venues</Link>
              <Link to="/dance-partners" className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary)] font-medium transition-colors">Dance Hub 🕺</Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <NotificationBell />
                <ThemeToggle />

                <Link
                  to="/dashboard"
                  className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary)] font-medium transition-colors hidden sm:block"
                >
                  Dashboard
                </Link>

                {user.role === 'admin' && (
                  <>
                    <Link to="/halls/manage" className="text-[color:var(--primary)] hover:text-[color:var(--primary-hover)] font-bold transition-colors hidden sm:block">🏛️ My Venues</Link>
                    <Link to="/events/create" className="text-[color:var(--primary)] hover:text-[color:var(--primary-hover)] font-bold transition-colors hidden sm:block bg-[color:rgba(var(--primary),0.12)] px-3.5 py-1.5 rounded-full text-xs">+ Host Event</Link>
                  </>
                )}

                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="group">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt="profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-transparent group-hover:border-[color:var(--primary)] transition-all shadow-sm"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[color:var(--text-muted)] hover:text-[color:var(--error)] font-medium text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[color:var(--text-secondary)] hover:text-[color:var(--primary)] font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-[color:var(--primary)] text-[color:var(--text-primary)] px-6 py-2.5 rounded-full font-semibold hover:bg-[color:var(--primary-hover)] transition-all shadow-lg shadow-[color:rgba(var(--primary),0.25)] transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
