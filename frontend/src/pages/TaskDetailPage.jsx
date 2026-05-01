import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { Avatar } from '../components/common/Avatar.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatDueDate, timeAgo } from '../utils/dateUtils.js';

export const TaskDetailPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tasks/${id}`)
      .then(({ data }) => setTask(data.task))
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load task'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner label="Loading task" />;
  if (!task) return null;

  return (
    <section className="panel detail-page">
      <Link to="/tasks">Back to tasks</Link>
      <h1>{task.title}</h1>
      <p>{task.description || 'No description.'}</p>
      <div className="inline-meta"><Badge>{task.status}</Badge><Badge tone="warning">{task.priority}</Badge><span>Due: {formatDueDate(task.dueDate)}</span></div>
      {task.assignee && <div className="member-row"><Avatar user={task.assignee} /><span>Assigned to {task.assignee.name}</span></div>}
      <footer>Created by {task.createdBy?.name} - updated {timeAgo(task.updatedAt)}</footer>
    </section>
  );
};
