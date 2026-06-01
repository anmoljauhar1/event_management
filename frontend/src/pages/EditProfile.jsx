import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.user.first_name || '',
        last_name: user.user.last_name || '',
        email: user.user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
      });
      if (user.avatar) setPreview(user.avatar);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (avatar) data.append('avatar', avatar);

    try {
      const updatedProfile = await updateProfile(data);
      updateUser(updatedProfile);   // update context
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError('Update failed. Please check your data.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-3">{success}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-gray-700">Avatar</label>
          {preview && <img src={preview} className="h-24 w-24 rounded-full object-cover mb-2" alt="Preview" />}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full border rounded p-2" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <input name="first_name" placeholder="First name" value={formData.first_name} onChange={handleChange} className="border rounded p-2" />
          <input name="last_name" placeholder="Last name" value={formData.last_name} onChange={handleChange} className="border rounded p-2" />
        </div>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2 mb-4" />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} className="w-full border rounded p-2 mb-4" />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 mb-4" />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2 mb-4" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;