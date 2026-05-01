import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { Button } from '../common/Button.jsx';
import { Modal } from '../common/Modal.jsx';

const colors = ['#FF6B35', '#00A676', '#FFC857', '#EF476F', '#118AB2', '#7B2CBF', '#F77F00', '#2EC4B6'];

export const ProjectForm = ({ open, onClose, onSaved }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', status: 'active', color: colors[0], members: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    api.get('/users').then(({ data }) => setUsers(data.users || [])).catch(() => setUsers([]));
  }, [open]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/projects', form);
      toast.success('Project created');
      onSaved();
      onClose();
      setForm({ name: '', description: '', deadline: '', status: 'active', color: colors[0], members: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="New Project" onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Deadline<input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></label>
        <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="on-hold">On hold</option><option value="completed">Completed</option></select></label>
        <div className="swatches">
          {colors.map((color) => (
            <button key={color} type="button" className={form.color === color ? 'swatch selected' : 'swatch'} style={{ background: color }} onClick={() => setForm({ ...form, color })} aria-label={`Use color ${color}`} />
          ))}
        </div>
        <label>
          Members
          <span className="field-hint">Hold Ctrl and click multiple names to select more than one member.</span>
          <select multiple value={form.members} onChange={(e) => setForm({ ...form, members: [...e.target.selectedOptions].map((option) => option.value) })}>{users.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}</select>
        </label>
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={loading}>{loading ? 'Saving...' : 'Create Project'}</Button>
        </div>
      </form>
    </Modal>
  );
};
