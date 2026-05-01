import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';

export const PageWrapper = () => (
  <div className="app-shell">
    <Sidebar />
    <main className="main-panel">
      <Navbar />
      <div className="page-content">
        <Outlet />
      </div>
    </main>
  </div>
);
