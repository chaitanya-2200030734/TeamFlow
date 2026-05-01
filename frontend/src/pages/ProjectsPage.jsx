import { FolderKanban, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '../components/common/Button.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { ProjectForm } from '../components/projects/ProjectForm.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useProjects } from '../hooks/useProjects.js';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { projects, loading, refresh } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => projects.filter((project) => (filter === 'all' || project.status === filter) && project.name.toLowerCase().includes(search.toLowerCase())), [filter, projects, search]);

  if (loading) return <Spinner label="Loading projects" />;

  return (
    <div className="stack">
      <div className="toolbar">
        <div className="filter-bar">
          <input placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All</option><option value="active">Active</option><option value="on-hold">On hold</option><option value="completed">Completed</option></select>
        </div>
        {user?.role === 'admin' && <Button onClick={() => setModalOpen(true)}><Plus size={16} /> New Project</Button>}
      </div>
      {filtered.length ? <div className="project-grid">{filtered.map((project) => <ProjectCard key={project._id} project={project} />)}</div> : <EmptyState icon={FolderKanban} title="No projects found" helper="Adjust filters or create a new project." />}
      <ProjectForm open={modalOpen} onClose={() => setModalOpen(false)} onSaved={refresh} />
    </div>
  );
};
