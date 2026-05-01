import { Navigate, Route, Routes } from 'react-router-dom';
import { PageWrapper } from './components/layout/PageWrapper.jsx';
import { Spinner } from './components/common/Spinner.jsx';
import { useAuth } from './hooks/useAuth.js';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { SignupPage } from './pages/auth/SignupPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { TaskDetailPage } from './pages/TaskDetailPage.jsx';
import { TasksPage } from './pages/TasksPage.jsx';
import { TeamPage } from './pages/TeamPage.jsx';
import { TeamflowAdminPage } from './pages/TeamflowAdminPage.jsx';
import { isTeamflowAdmin } from './utils/roleUtils.js';

const HomeRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={isTeamflowAdmin(user) ? '/teamflow-admin' : '/dashboard'} replace />;
};

const ProtectedRoute = ({ children, adminOnly = false, teamflowAdminOnly = false, allowTeamflowAdmin = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (teamflowAdminOnly && !isTeamflowAdmin(user)) return <Navigate to="/dashboard" replace />;
  if (!teamflowAdminOnly && !allowTeamflowAdmin && isTeamflowAdmin(user)) return <Navigate to="/teamflow-admin" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicOnly = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (isAuthenticated) return <HomeRedirect />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
      <Route element={<ProtectedRoute><PageWrapper /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/team" element={<ProtectedRoute adminOnly><TeamPage /></ProtectedRoute>} />
      </Route>
      <Route element={<ProtectedRoute allowTeamflowAdmin><PageWrapper /></ProtectedRoute>}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute teamflowAdminOnly><PageWrapper /></ProtectedRoute>}>
        <Route path="/teamflow-admin" element={<TeamflowAdminPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
