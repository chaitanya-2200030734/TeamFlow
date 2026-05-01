export const TaskFilters = ({ filters, onChange, showAssigneeFilter = false }) => (
  <div className="filter-bar">
    <input placeholder="Search tasks" value={filters.search || ''} onChange={(e) => onChange({ ...filters, search: e.target.value })} />
    <select value={filters.status || ''} onChange={(e) => onChange({ ...filters, status: e.target.value })}>
      <option value="">All statuses</option>
      <option value="todo">Todo</option>
      <option value="in-progress">In progress</option>
      <option value="review">Review</option>
      <option value="done">Done</option>
    </select>
    <select value={filters.priority || ''} onChange={(e) => onChange({ ...filters, priority: e.target.value })}>
      <option value="">All priorities</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
    {showAssigneeFilter && (
      <select value={filters.assignee || ''} onChange={(e) => onChange({ ...filters, assignee: e.target.value })}>
        <option value="">All assignments</option>
        <option value="unassigned">Unassigned</option>
      </select>
    )}
  </div>
);
