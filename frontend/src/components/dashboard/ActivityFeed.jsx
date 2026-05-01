import { timeAgo } from '../../utils/dateUtils.js';
import { Badge } from '../common/Badge.jsx';

export const ActivityFeed = ({ tasks }) => (
  <section className="panel">
    <div className="panel-heading">
      <h2>Recent Activity</h2>
    </div>
    <div className="activity-list">
      {tasks.slice(0, 10).map((task) => (
        <div className="activity-item" key={task._id}>
          <div>
            <strong>{task.title}</strong>
            <p>{task.project?.name || 'No project'} - {timeAgo(task.updatedAt)}</p>
          </div>
          <Badge tone="neutral">{task.status}</Badge>
        </div>
      ))}
    </div>
  </section>
);
