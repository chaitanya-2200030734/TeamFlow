import { FolderKanban, RefreshCw, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { Avatar } from '../components/common/Avatar.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { useAuth } from '../hooks/useAuth.js';

export const TeamPage = () => {
  const { user, updateCurrentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [organization, setOrganization] = useState(user?.organization);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTeam = () => {
    setLoading(true);
    Promise.all([api.get('/users'), api.get('/projects')])
      .then(([userRes, projectRes]) => {
        setUsers(userRes.data.users || []);
        setProjects(projectRes.data.projects || []);
      })
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load team'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    setOrganization(user?.organization);
  }, [user?.organization]);

  const resetInviteCode = async () => {
    if (!window.confirm('Reset the invite code? The old code will stop working.')) return;

    try {
      const { data } = await api.patch('/organizations/invite-code/reset');
      setOrganization(data.organization);
      updateCurrentUser({ organization: data.organization });
      toast.success('Invite code reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reset invite code');
    }
  };

  const projectsForMember = (memberId) => projects.filter((project) => {
    return (project.members || []).some((member) => member._id === memberId);
  });

  const removeMember = async (member) => {
    if (!window.confirm(`Remove ${member.name} from this organization? Their assigned tasks will become unassigned.`)) return;

    try {
      await api.delete(`/users/${member._id}`);
      toast.success('Team member removed');
      setSelectedMember(null);
      loadTeam();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove team member');
    }
  };

  if (loading) return <Spinner label="Loading team" />;

  return users.length ? (
    <div className="stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>{organization?.name || 'Organization'} Team</h2>
          <Button variant="secondary" onClick={resetInviteCode}><RefreshCw size={16} /> Reset Invite Code</Button>
        </div>
        <p className="muted-copy">Invite code: <strong className="mono">{organization?.inviteCode}</strong></p>
      </section>
      <section className="panel">
        <div className="panel-heading"><h2>Team Members</h2></div>
        <div className="member-list">
          {users.map((member) => {
            const assignedProjects = projectsForMember(member._id);
            const isSelf = member._id === user?._id;

            return (
              <div className="member-row team-member-row" key={member._id}>
                <Avatar user={member} />
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.email}</p>
                </div>
                <Badge tone={member.role === 'admin' ? 'warning' : 'success'}>{member.role}</Badge>
                <Button variant="secondary" size="sm" onClick={() => setSelectedMember(member)}>
                  <FolderKanban size={14} /> {assignedProjects.length} Project{assignedProjects.length === 1 ? '' : 's'}
                </Button>
                {!isSelf && <Button variant="danger" size="sm" onClick={() => removeMember(member)}><Trash2 size={14} /> Remove</Button>}
              </div>
            );
          })}
        </div>
      </section>
      <Modal open={Boolean(selectedMember)} title={selectedMember ? `${selectedMember.name}'s Projects` : 'Assigned Projects'} onClose={() => setSelectedMember(null)}>
        <div className="project-assignment-list">
          {selectedMember && projectsForMember(selectedMember._id).length ? projectsForMember(selectedMember._id).map((project) => (
            <div className="assignment-row" key={project._id} style={{ borderLeftColor: project.color }}>
              <strong>{project.name}</strong>
              <Badge tone={project.status === 'completed' ? 'success' : project.status === 'on-hold' ? 'warning' : 'neutral'}>{project.status}</Badge>
            </div>
          )) : <p className="muted-copy">No projects assigned to this member yet.</p>}
        </div>
      </Modal>
    </div>
  ) : <EmptyState icon={Users} title="No team members" helper="Invite members by creating their accounts." />;
};
