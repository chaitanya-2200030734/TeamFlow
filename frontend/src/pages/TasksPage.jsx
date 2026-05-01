import { CheckSquare, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { TaskBoard } from '../components/tasks/TaskBoard.jsx';
import { TaskFilters } from '../components/tasks/TaskFilters.jsx';
import { TaskForm } from '../components/tasks/TaskForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useTasks } from '../hooks/useTasks.js';

export const TasksPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  const [adminTaskView, setAdminTaskView] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const isMember = user?.role === 'member';
  const isMyTaskView = isMember || adminTaskView === 'my';
  const apiFilters = isMember ? {} : {
    status: filters.status || undefined,
    priority: filters.priority || undefined,
    unassigned: filters.assignee === 'unassigned' ? 'true' : undefined,
    limit: 100
  };
  const { tasks, loading, refresh } = useTasks(isMyTaskView ? {} : apiFilters, isMyTaskView ? '/tasks/my' : '/tasks');
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes((filters.search || '').toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesAssignment = isMyTaskView || filters.assignee !== 'unassigned' || !task.assignee;
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignment;
  }), [filters, isMyTaskView, tasks]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => setUsers([]));
  }, [user?.role]);

  const addTask = (status = 'todo') => {
    setDefaultStatus(status);
    setModalOpen(true);
  };

  if (loading) return <Spinner label="Loading tasks" />;

  return (
    <div className="stack">
      {user?.role === 'admin' && (
        <div className="tabs task-subtabs">
          <button className={adminTaskView === 'my' ? 'active' : ''} onClick={() => setAdminTaskView('my')}>My Tasks</button>
          <button className={adminTaskView === 'all' ? 'active' : ''} onClick={() => setAdminTaskView('all')}>All Tasks</button>
        </div>
      )}
      <div className="toolbar">
        <TaskFilters filters={filters} onChange={setFilters} showAssigneeFilter={user?.role === 'admin' && adminTaskView === 'all'} />
        {user?.role === 'admin' && <Button onClick={() => addTask()}><Plus size={16} /> New Task</Button>}
      </div>
      {visibleTasks.length ? <TaskBoard tasks={visibleTasks} onChanged={refresh} onAddTask={addTask} assignableUsers={users} /> : <EmptyState icon={CheckSquare} title="No tasks yet" helper={isMember ? 'Tasks assigned to you will appear here.' : 'Create tasks and they will appear on the board.'} />}
      <TaskForm open={modalOpen} onClose={() => setModalOpen(false)} onSaved={refresh} defaultStatus={defaultStatus} />
    </div>
  );
};
