import { Building2, CheckSquare, FolderKanban, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { Avatar } from '../common/Avatar.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

const baseNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/profile', label: 'Settings', icon: Settings }
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navItems = user?.role === 'teamflow-admin'
    ? [{ to: '/teamflow-admin', label: 'Organizations', icon: Building2 }, { to: '/profile', label: 'Settings', icon: Settings }]
    : user?.role === 'admin'
    ? [...baseNav.slice(0, 3), { to: '/team', label: 'Team', icon: Users }, baseNav[3]]
    : baseNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Button className="mobile-menu" variant="secondary" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={20} />
      </Button>
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">TeamFlow</div>
          <Button className="sidebar-close" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </Button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <Avatar user={user} />
          <div className="sidebar-user-copy">
            <strong>{user?.name}</strong>
            <Badge tone={user?.role === 'member' ? 'success' : 'warning'}>{user?.role}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut size={18} />
          </Button>
        </div>
      </aside>
    </>
  );
};
