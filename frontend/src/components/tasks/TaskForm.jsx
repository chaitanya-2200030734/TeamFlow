import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';

export const TaskForm = ({ open, onClose, onSaved, defaultStatus = 'todo', projectId }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({ title: '', description: '', project: projectId || '', assignee: '', priority: 'medium', status: defaultStatus, dueDate: '', tags: [] });
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('17:00');

  useEffect(() => {
    if (!open) return;
    Promise.all([api.get('/projects'), api.get('/users')])
      .then(([projectRes, userRes]) => {
        setProjects(projectRes.data.projects || []);
        setUsers(userRes.data.users || []);
      })
      .catch(() => toast.error('Could not load form data'));
  }, [open]);

  useEffect(() => {
    setForm((current) => ({ ...current, status: defaultStatus, project: projectId || current.project }));
  }, [defaultStatus, projectId]);

  const addTag = (event) => {
    if (event.key !== 'Enter' || !tagInput.trim()) return;
    event.preventDefault();
    setForm({ ...form, tags: [...new Set([...form.tags, tagInput.trim()])] });
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) });
  };

  const submit = async (event) => {
    event.preventDefault();
    const resolvedDueDate = dueDate ? `${dueDate}T${dueTime || '17:00'}` : null;
    try {
      await api.post('/tasks', { ...form, dueDate: resolvedDueDate, assignee: form.assignee || null });
      toast.success('Task created');
      onSaved();
      onClose();
      setForm({ title: '', description: '', project: projectId || '', assignee: '', priority: 'medium', status: defaultStatus, dueDate: '', tags: [] });
      setDueDate('');
      setDueTime('17:00');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not create task');
    }
  };

  return (
    <Modal open={open} title="New Task" onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <label>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Project<select required value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>{!projectId && <option value="">Select project</option>}{projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}</select></label>
        <label>Assignee<select value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}><option value="">Unassigned</option>{users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}</select></label>
        <label>Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option></select></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="todo">Todo</option><option value="in-progress">In progress</option><option value="review">Review</option><option value="done">Done</option></select></label>
        <div className="date-time-grid">
          <label>Due date<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
          <label>Due time<input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} /></label>
        </div>
        <label>Tags<input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Press Enter to add" /></label>
        <div className="tag-row editable-tags">
          {form.tags.map((tag) => (
            <span key={tag}>
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag} tag`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="modal-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button>Create Task</Button></div>
      </form>
    </Modal>
  );
};
