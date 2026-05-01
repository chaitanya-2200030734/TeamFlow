import { Bell, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { Avatar } from '../common/Avatar.jsx';
import { Button } from '../common/Button.jsx';

const titles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'My Tasks',
  '/profile': 'Profile',
  '/team': 'Team',
  '/teamflow-admin': 'Organizations'
};

export const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const title = titles[location.pathname] || (location.pathname.startsWith('/projects/') ? 'Project Detail' : 'TeamFlow');

  return (
    <header className="navbar">
      <div>
        <p className="eyebrow">Workspace</p>
        <h1>{title}</h1>
      </div>
      <div className="navbar-actions">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Avatar user={user} />
      </div>
    </header>
  );
};
