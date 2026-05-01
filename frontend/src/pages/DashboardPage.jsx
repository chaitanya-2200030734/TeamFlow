import { AlertTriangle, CheckCircle, CheckSquare, FolderKanban } from 'lucide-react';
import { ActivityFeed } from '../components/dashboard/ActivityFeed.jsx';
import { OverdueBanner } from '../components/dashboard/OverdueBanner.jsx';
import { StatsCard } from '../components/dashboard/StatsCard.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { useTasks } from '../hooks/useTasks.js';
import { isOverdue } from '../utils/dateUtils.js';

export const DashboardPage = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks({ limit: 100 });
  const loading = projectsLoading || tasksLoading;
  const overdue = tasks.filter((task) => isOverdue(task.dueDate, task.status));
  const completedToday = tasks.filter((task) => task.status === 'done' && new Date(task.updatedAt).toDateString() === new Date().toDateString());
  const statusCounts = ['todo', 'in-progress', 'review', 'done'].map((status) => ({ status, count: tasks.filter((task) => task.status === status).length }));

  if (loading) return <Spinner label="Loading dashboard" />;

  return (
    <div className="stack">
      <OverdueBanner count={overdue.length} />
      <div className="stats-grid">
        <StatsCard icon={FolderKanban} label="Total Projects" value={projects.length} />
        <StatsCard icon={CheckSquare} label="My Tasks" value={tasks.length} tone="success" />
        <StatsCard icon={AlertTriangle} label="Overdue Tasks" value={overdue.length} tone="warning" />
        <StatsCard icon={CheckCircle} label="Completed Today" value={completedToday.length} tone="success" />
      </div>
      <section className="panel">
        <div className="panel-heading"><h2>Task Status Breakdown</h2></div>
        <div className="status-bars">
          {statusCounts.map((item) => <span key={item.status} className={`bar-${item.status}`} style={{ width: `${tasks.length ? (item.count / tasks.length) * 100 : 0}%` }} title={`${item.status}: ${item.count}`} />)}
        </div>
      </section>
      {tasks.length ? <ActivityFeed tasks={tasks} /> : <EmptyState icon={CheckSquare} title="No tasks yet" helper="Create your first task to start tracking team progress." />}
    </div>
  );
};
