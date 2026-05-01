import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/Button.jsx';
import { TaskCard } from './TaskCard.jsx';

const columns = [
  ['todo', 'Todo'],
  ['in-progress', 'In Progress'],
  ['review', 'Review'],
  ['done', 'Done']
];

export const TaskBoard = ({ tasks, onChanged, onAddTask, assignableUsers = [] }) => {
  const { user } = useAuth();

  return (
    <div className="kanban">
      {columns.map(([status, label]) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section className="kanban-column" key={status}>
            <header>
              <h2>{label}</h2>
              <span>{columnTasks.length}</span>
            </header>
            <div className="kanban-list">
              {columnTasks.map((task) => <TaskCard key={task._id} task={task} onChanged={onChanged} assignableUsers={assignableUsers} />)}
            </div>
            {user?.role === 'admin' && (
              <Button variant="secondary" onClick={() => onAddTask?.(status)}>
                <Plus size={16} /> Add Task
              </Button>
            )}
          </section>
        );
      })}
    </div>
  );
};
