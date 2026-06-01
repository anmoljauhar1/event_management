import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="h-32 w-32 rounded-full object-cover border-4 border-indigo-200"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.user.first_name} {user.user.last_name}</h2>
          <p className="text-gray-600">@{user.user.username}</p>
          <p className="text-gray-600">{user.user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="font-medium">Bio:</span> {user.bio || 'No bio'}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {user.phone || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Location:</span> {user.location || 'N/A'}
        </div>
      </div>
      <Link
        to="/profile/edit"
        className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Edit Profile
      </Link>
    </div>
  );
};

export default Profile;