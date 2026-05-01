import { CheckCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { canUpdateTaskStatus } from '../../utils/roleUtils.js';
import { dueTone, formatDueDate, isOverdue } from '../../utils/dateUtils.js';
import { Avatar } from '../common/Avatar.jsx';
import { Button } from '../common/Button.jsx';
import { Tooltip } from '../common/Tooltip.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const TaskCard = ({ task, onChanged, assignableUsers = [] }) => {
  const { user } = useAuth();
  const canChange = canUpdateTaskStatus(user, task);
  const isAdmin = user?.role === 'admin';
  const shouldPulse = task.priority === 'critical' && task.status !== 'done';

  const updateStatus = async (status) => {
    try {
      await api.patch(`/tasks/${task._id}/status`, { status });
      toast.success('Status updated');
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update status');
    }
  };

  const updateAssignee = async (assignee) => {
    try {
      await api.put(`/tasks/${task._id}`, { assignee: assignee || null });
      toast.success(assignee ? 'Task assigned' : 'Task unassigned');
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update assignee');
    }
  };

  const deleteTask = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted');
      onChanged?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete task');
    }
  };

  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-top">
        <h3>{task.title}</h3>
        {shouldPulse && <span className="pulse-dot" />}
        {task.status === 'done' && <CheckCircle className="done-mark" size={18} />}
      </div>
      <div className="tag-row">{(task.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <p className={`due ${dueTone(task.dueDate, task.status)}`}>{isOverdue(task.dueDate, task.status) ? 'Overdue: ' : 'Due: '}{formatDueDate(task.dueDate)}</p>
      <div className="task-meta">
        {task.assignee && (
          <Tooltip label={task.assignee.name}>
            <Avatar user={task.assignee} size="sm" />
          </Tooltip>
        )}
        {!task.assignee && <span>Unassigned</span>}
        <span>{task.project?.name}</span>
      </div>
      {isAdmin && (
        <label className="task-field">
          Assign
          <select value={task.assignee?._id || ''} onChange={(event) => updateAssignee(event.target.value)}>
            <option value="">Unassigned</option>
            {assignableUsers.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
          </select>
        </label>
      )}
      <select value={task.status} disabled={!canChange} onChange={(event) => updateStatus(event.target.value)}>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>
      {isAdmin && (
        <div className="task-actions">
          <Button variant="danger" size="sm" onClick={deleteTask}><Trash2 size={14} /> Delete</Button>
        </div>
      )}
    </article>
  );
};
