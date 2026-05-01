import { Building2, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Spinner } from '../components/common/Spinner.jsx';

export const TeamflowAdminPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrganizations = () => {
    setLoading(true);
    api.get('/organizations')
      .then(({ data }) => setOrganizations(data.organizations || []))
      .catch((error) => toast.error(error.response?.data?.message || 'Could not load organizations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const replaceOrganization = (updatedOrganization) => {
    setOrganizations((current) => current.map((organization) => (
      organization._id === updatedOrganization._id ? updatedOrganization : organization
    )));
  };

  const resetInviteCode = async (organization) => {
    if (!window.confirm(`Reset invite code for ${organization.name}? The old code will stop working.`)) return;

    try {
      const { data } = await api.patch(`/organizations/${organization._id}/invite-code/reset`);
      replaceOrganization(data.organization);
      toast.success('Invite code reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reset invite code');
    }
  };

  const removeOrganization = async (organization) => {
    if (!window.confirm(`Remove ${organization.name}? This permanently removes the organization and its workspace data.`)) return;

    try {
      await api.delete(`/organizations/${organization._id}`);
      setOrganizations((current) => current.filter((item) => item._id !== organization._id));
      toast.success('Organization removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove organization');
    }
  };

  if (loading) return <Spinner label="Loading organizations" />;

  return organizations.length ? (
    <div className="stack">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>TeamFlow Admin</h2>
            <p className="muted-copy">Manage the organizations registered on TeamFlow.</p>
          </div>
          <Button variant="secondary" onClick={loadOrganizations}><RefreshCw size={16} /> Refresh</Button>
        </div>
      </section>

      <section className="organization-list">
        {organizations.map((organization) => (
          <article className="organization-row" key={organization._id}>
            <div className="organization-main">
              <Building2 size={20} />
              <div>
                <strong>{organization.name}</strong>
                <p>{organization.slug}</p>
              </div>
            </div>
            <div className="organization-stats">
              <Badge>Invite {organization.inviteCode}</Badge>
              <Badge tone="success">Created {new Date(organization.createdAt).toLocaleDateString()}</Badge>
            </div>
            <div className="organization-actions">
              <Button variant="secondary" size="sm" onClick={() => resetInviteCode(organization)}><RefreshCw size={14} /> Reset Code</Button>
              <Button variant="danger" size="sm" onClick={() => removeOrganization(organization)}><Trash2 size={14} /> Remove</Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  ) : <EmptyState icon={Building2} title="No organizations yet" helper="Organizations created by customers will appear here." />;
};
