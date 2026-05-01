import { Avatar } from '../common/Avatar.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export const MemberManager = ({ members = [], isAdmin, ownerId, currentUserId, onRemove }) => (
  <section className="panel">
    <div className="panel-heading">
      <h2>Members</h2>
    </div>
    <div className="member-list">
      {members.map((member) => (
        <div className="member-row" key={member._id}>
          <Avatar user={member} />
          <div>
            <strong>{member.name}</strong>
            <p>{member.email}</p>
          </div>
          <Badge tone={member.role === 'admin' ? 'warning' : 'success'}>{member.role}</Badge>
          {member._id === ownerId && <Badge tone="warning">Owner</Badge>}
          {member._id === currentUserId && member._id !== ownerId && <Badge tone="neutral">You</Badge>}
          {isAdmin && member._id !== ownerId && member._id !== currentUserId && <Button variant="ghost" onClick={() => onRemove?.(member)}>Remove</Button>}
        </div>
      ))}
    </div>
  </section>
);
