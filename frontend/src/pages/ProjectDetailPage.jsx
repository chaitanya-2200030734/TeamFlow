import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { MemberManager } from '../components/projects/MemberManager.jsx';
import { TaskBoard } from '../components/tasks/TaskBoard.jsx';
import { TaskForm } from '../components/tasks/TaskForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { formatDueDate } from '../utils/dateUtils.js';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModal, setTaskModal] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [activeTab, setActiveTab] = useState('tasks');
  const [memberToAdd, setMemberToAdd] = useState('');
  const [settingsForm, setSettingsForm] = useState({ name: '', description: '', status: 'active', deadline: '', color: '#C0622F' });

  const load = async () => {
    setLoading(true);
    try {
      const [projectRes, taskRes] = await Promise.all([api.get(`/projects/${id}`), api.get('/tasks', { params: { project: id, limit: 100 } })]);
      const nextProject = projectRes.data.project;
      setProject(nextProject);
      setTasks(taskRes.data.tasks || []);
      setSettingsForm({
        name: nextProject.name || '',
        description: nextProject.description || '',
        status: nextProject.status || 'active',
        deadline: nextProject.deadline ? nextProject.deadline.slice(0, 10) : '',
        color: nextProject.color || '#C0622F'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => setUsers([]));
  }, [user?.role]);

  const addTask = (status) => {
    setDefaultStatus(status);
    setTaskModal(true);
  };

  const deleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete project');
    }
  };

  const addMember = async () => {
    if (!memberToAdd) return;

    try {
      const { data } = await api.post(`/projects/${id}/members`, { userId: memberToAdd });
      setProject(data.project);
      setMemberToAdd('');
      toast.success('Member added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add member');
    }
  };

  const removeMember = async (member) => {
    try {
      const { data } = await api.delete(`/projects/${id}/members/${member._id}`);
      setProject(data.project);
      toast.success('Member removed');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove member');
    }
  };

  const updateProject = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...settingsForm, deadline: settingsForm.deadline || null };
      const { data } = await api.put(`/projects/${id}`, payload);
      setProject(data.project);
      toast.success('Project updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update project');
    }
  };

  if (loading) return <Spinner label="Loading project" />;
  if (!project) return null;

  const memberIds = new Set((project.members || []).map((member) => member._id));
  const availableMembers = users.filter((teamUser) => !memberIds.has(teamUser._id));

  return (
    <div className="stack">
      <Link className="back-link" to="/projects"><ArrowLeft size={16} /> Projects</Link>
      <section className="detail-header" style={{ borderLeftColor: project.color }}>
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="inline-meta"><Badge>{project.status}</Badge><span>Owner: {project.owner?.name}</span><span>Deadline: {formatDueDate(project.deadline)}</span></div>
        </div>
        {user?.role === 'admin' && <Button variant="danger" onClick={() => setDeleteOpen(true)}><Trash2 size={16} /> Delete</Button>}
      </section>
      <div className="tabs">
        <button className={activeTab === 'tasks' ? 'active' : ''} onClick={() => setActiveTab('tasks')}>Tasks</button>
        <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>Members</button>
        {user?.role === 'admin' && <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>}
      </div>

      {activeTab === 'tasks' && (
        <>
          {user?.role === 'admin' && <Button className="fit" onClick={() => addTask('todo')}><Plus size={16} /> Add Task</Button>}
          <TaskBoard tasks={tasks} onChanged={load} onAddTask={addTask} assignableUsers={project.members || []} />
        </>
      )}

      {activeTab === 'members' && (
        <div className="stack">
          {user?.role === 'admin' && (
            <section className="panel">
              <div className="panel-heading"><h2>Add Member</h2></div>
              <div className="inline-form">
                <select value={memberToAdd} onChange={(event) => setMemberToAdd(event.target.value)}>
                  <option value="">Select a team member</option>
                  {availableMembers.map((teamUser) => <option key={teamUser._id} value={teamUser._id}>{teamUser.name} - {teamUser.email}</option>)}
                </select>
                <Button onClick={addMember} disabled={!memberToAdd}><Plus size={16} /> Add</Button>
              </div>
            </section>
          )}
          <MemberManager
            members={project.members}
            isAdmin={user?.role === 'admin'}
            ownerId={project.owner?._id}
            currentUserId={user?._id}
            onRemove={removeMember}
          />
        </div>
      )}

      {activeTab === 'settings' && user?.role === 'admin' && (
        <section className="panel">
          <div className="panel-heading"><h2>Project Settings</h2></div>
          <form className="form-grid" onSubmit={updateProject}>
            <label>Name<input required value={settingsForm.name} onChange={(event) => setSettingsForm({ ...settingsForm, name: event.target.value })} /></label>
            <label>Description<textarea value={settingsForm.description} onChange={(event) => setSettingsForm({ ...settingsForm, description: event.target.value })} /></label>
            <label>Status<select value={settingsForm.status} onChange={(event) => setSettingsForm({ ...settingsForm, status: event.target.value })}><option value="active">Active</option><option value="on-hold">On hold</option><option value="completed">Completed</option></select></label>
            <label>Deadline<input type="date" value={settingsForm.deadline} onChange={(event) => setSettingsForm({ ...settingsForm, deadline: event.target.value })} /></label>
            <label>Accent color<input type="color" value={settingsForm.color} onChange={(event) => setSettingsForm({ ...settingsForm, color: event.target.value })} /></label>
            <Button className="fit"><Save size={16} /> Save Changes</Button>
          </form>
        </section>
      )}

      <TaskForm open={taskModal} onClose={() => setTaskModal(false)} onSaved={load} defaultStatus={defaultStatus} projectId={id} />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete project?"
        message="This will permanently delete the project and all tasks inside it."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={deleteProject}
      />
    </div>
  );
};
