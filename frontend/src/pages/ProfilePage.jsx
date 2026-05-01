import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { Avatar } from '../components/common/Avatar.jsx';
import { Button } from '../components/common/Button.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../hooks/useAuth.js';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');

  const save = async () => {
    try {
      await api.put(`/users/${user._id}`, { name });
      toast.success('Profile updated');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile');
    }
  };

  return (
    <section className="panel profile-page">
      <Avatar user={{ ...user, name }} size="lg" />
      <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label>Email<input readOnly value={user?.email || ''} /></label>
      <div className="toolbar">
        <Button onClick={save}>Save Profile</Button>
        <Button variant="secondary" onClick={toggleTheme}>Theme: {theme}</Button>
      </div>
    </section>
  );
};
