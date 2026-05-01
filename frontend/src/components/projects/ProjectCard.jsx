import { useNavigate } from 'react-router-dom';
import { formatDueDate, isOverdue } from '../../utils/dateUtils.js';
import { Avatar } from '../common/Avatar.jsx';
import { Badge } from '../common/Badge.jsx';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const total = project.taskStats?.total || 0;
  const done = project.taskStats?.done || 0;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <article className="project-card" style={{ borderLeftColor: project.color }} onClick={() => navigate(`/projects/${project._id}`)}>
      <div className="project-card-top">
        <h2>{project.name}</h2>
        <Badge tone={project.status === 'completed' ? 'success' : project.status === 'on-hold' ? 'warning' : 'neutral'}>{project.status}</Badge>
      </div>
      <p className="clamp">{project.description || 'No description yet.'}</p>
      <div className="avatar-stack">
        {(project.members || []).slice(0, 4).map((member) => <Avatar key={member._id} user={member} size="sm" />)}
        {(project.members?.length || 0) > 4 && <span className="avatar-overflow">+{project.members.length - 4}</span>}
      </div>
      <div className="progress-row">
        <span>{done}/{total} tasks</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <p className={isOverdue(project.deadline, project.status) ? 'due danger' : 'due'}>
        Deadline: {formatDueDate(project.deadline)}
      </p>
    </article>
  );
};
